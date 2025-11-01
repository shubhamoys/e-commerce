import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ProductServiceClient } from '../common/clients/product-service.client';

@Injectable()
export class CartService {
  private readonly productServiceClient: ProductServiceClient;

  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly configService: ConfigService,
  ) {
    this.productServiceClient = new ProductServiceClient(this.configService);
  }

  async getCart(customerId: string) {
    let cart = await this.cartRepository.findOne({
      where: { customerId },
      relations: ['items'],
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = this.cartRepository.create({ customerId, items: [] });
      await this.cartRepository.save(cart);
    }

    // Calculate total
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.productPrice) * item.quantity,
      0,
    );

    return {
      cart,
      totalAmount,
      itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  async addToCart(customerId: string, addToCartDto: AddToCartDto) {
    const { productId, quantity } = addToCartDto;

    // Fetch product details from Product Service
    let productData;
    try {
      productData = await this.productServiceClient.getProduct(productId);
    } catch (error: any) {
      throw new BadRequestException(
        error.message || 'Failed to validate product',
      );
    }

    const product = productData.data.product;
    const productName = product.name;
    const productPrice = product.price;

    // Get or create cart
    let cart = await this.cartRepository.findOne({
      where: { customerId },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepository.create({ customerId });
      await this.cartRepository.save(cart);
    }

    // Check if item already exists in cart
    const existingItem = cart.items?.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      // Update quantity and refresh price (in case product price changed)
      existingItem.quantity += quantity;
      existingItem.productPrice = productPrice;
      existingItem.productName = productName;
      await this.cartItemRepository.save(existingItem);
    } else {
      // Add new item
      const cartItem = this.cartItemRepository.create({
        cartId: cart.id,
        productId,
        productName,
        productPrice,
        quantity,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return this.getCart(customerId);
  }

  async updateCartItem(
    customerId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ) {
    const cart = await this.cartRepository.findOne({
      where: { customerId },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.items?.find((item) => item.id === itemId);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    cartItem.quantity = updateCartItemDto.quantity;
    await this.cartItemRepository.save(cartItem);

    return this.getCart(customerId);
  }

  async removeCartItem(customerId: string, itemId: string) {
    const cart = await this.cartRepository.findOne({
      where: { customerId },
      relations: ['items'],
    });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const cartItem = cart.items?.find((item) => item.id === itemId);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(cartItem);

    return this.getCart(customerId);
  }

  async clearCart(customerId: string) {
    const cart = await this.cartRepository.findOne({
      where: { customerId },
      relations: ['items'],
    });

    if (cart && cart.items) {
      await this.cartItemRepository.remove(cart.items);
    }

    return this.getCart(customerId);
  }
}
