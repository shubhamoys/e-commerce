import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerOrder } from '../customers/entities/customer-order.entity';
import { CartService } from '../cart/cart.service';

@Injectable()
export class MessagingService implements OnModuleInit {
  constructor(
    @InjectRepository(CustomerOrder)
    private readonly customerOrderRepository: Repository<CustomerOrder>,
    private readonly cartService: CartService,
  ) {}

  async onModuleInit() {
    console.log('✅ RabbitMQ listener initialized in Customer Service');
  }

  async handleOrderCreated(orderData: any) {
    try {
      console.log('📥 Processing order.created event', orderData);

      // Save order to customer_orders table
      const customerOrder = this.customerOrderRepository.create({
        customerId: orderData.customerId,
        orderId: orderData.orderId,
        totalAmount: orderData.totalAmount,
        orderDate: new Date(orderData.orderDate),
      });

      await this.customerOrderRepository.save(customerOrder);
      console.log('✅ Customer order saved successfully');

      // Clear the customer's cart after successful order
      await this.cartService.clearCart(orderData.customerId);
      console.log('✅ Cart cleared after order creation');
    } catch (error) {
      console.error('❌ Error handling order.created event:', error);
      throw error;
    }
  }
}

