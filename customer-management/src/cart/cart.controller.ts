import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Customer } from '../customers/entities/customer.entity';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCart(@GetUser() user: Customer) {
    const result = await this.cartService.getCart(user.id);
    return {
      success: true,
      message: 'Cart retrieved successfully',
      data: result,
    };
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  async addToCart(
    @GetUser() user: Customer,
    @Body() addToCartDto: AddToCartDto,
  ) {
    const result = await this.cartService.addToCart(user.id, addToCartDto);
    return {
      success: true,
      message: 'Item added to cart successfully',
      data: result,
    };
  }

  @Put('items/:itemId')
  @HttpCode(HttpStatus.OK)
  async updateCartItem(
    @GetUser() user: Customer,
    @Param('itemId') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const result = await this.cartService.updateCartItem(
      user.id,
      itemId,
      updateCartItemDto,
    );
    return {
      success: true,
      message: 'Cart item updated successfully',
      data: result,
    };
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.OK)
  async removeCartItem(
    @GetUser() user: Customer,
    @Param('itemId') itemId: string,
  ) {
    const result = await this.cartService.removeCartItem(user.id, itemId);
    return {
      success: true,
      message: 'Item removed from cart successfully',
      data: result,
    };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearCart(@GetUser() user: Customer) {
    const result = await this.cartService.clearCart(user.id);
    return {
      success: true,
      message: 'Cart cleared successfully',
      data: result,
    };
  }
}
