import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    return {
      success: true,
      message: 'Order created successfully',
      data: { order },
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    return {
      success: true,
      message: 'Order retrieved successfully',
      data: { order },
    };
  }

  @Get('customer/:customerId')
  @HttpCode(HttpStatus.OK)
  async findByCustomerId(@Param('customerId') customerId: string) {
    const orders = await this.ordersService.findByCustomerId(customerId);
    return {
      success: true,
      message: 'Orders retrieved successfully',
      data: { orders },
    };
  }
}
