import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  queue: process.env.RABBITMQ_QUEUE || 'product_order_service_queue',
  exchange: process.env.RABBITMQ_EXCHANGE || 'ecommerce_events',
}));
