import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { ProductsService } from '../products/products.service';
import { MessagingService } from '../messaging/messaging.service';
import { OrderStatus } from '../common/enums';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly productsService: ProductsService,
    private readonly messagingService: MessagingService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: any): Promise<Order> {
    const { items } = createOrderDto;

    // Get customer info from JWT token
    const customerId = user.id;
    const customerEmail = user.email;
    const customerName = user.name;

    // Validate all products exist and calculate totals
    const orderItems: Partial<OrderItem>[] = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await this.productsService.findOne(item.productId);

      const subtotal = Number(product.price) * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: Number(product.price),
        subtotal: subtotal,
      });
    }

    // Create order with items
    const order = this.orderRepository.create({
      customerId,
      customerEmail,
      customerName,
      totalAmount,
      status: OrderStatus.PENDING,
      items: orderItems as OrderItem[],
    });

    const savedOrder = await this.orderRepository.save(order);

    // Publish order.created event to RabbitMQ
    await this.messagingService.publishOrderCreated({
      orderId: savedOrder.id,
      customerId: savedOrder.customerId,
      customerEmail: savedOrder.customerEmail,
      totalAmount: Number(savedOrder.totalAmount),
      items: savedOrder.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: Number(item.price),
      })),
      orderDate: savedOrder.createdAt,
    });

    return savedOrder;
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { customerId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }
}
