import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MessagingService implements OnModuleInit {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async onModuleInit() {
    await this.client.connect();
    console.log('✅ RabbitMQ connected in Product & Order Service');
  }

  async publishOrderCreated(orderData: any) {
    try {
      const pattern = 'order.created';
      console.log(`📤 Publishing event: ${pattern}`, orderData);
      this.client.emit(pattern, orderData);
      console.log(`✅ Event published: ${pattern}`);
    } catch (error) {
      console.error('❌ Error publishing order.created event:', error);
      throw error;
    }
  }
}
