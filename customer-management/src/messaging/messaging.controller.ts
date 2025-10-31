import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MessagingService } from './messaging.service';

@Controller()
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @EventPattern('order.created')
  async handleOrderCreated(@Payload() data: any) {
    console.log('📥 Received event: order.created', data);
    await this.messagingService.handleOrderCreated(data);
    return { received: true };
  }
}
