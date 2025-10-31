import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: any) {
    const order = await this.ordersService.create(createOrderDto);
    return {
      success: true,
      message: 'Order created successfully',
      data: { order },
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string, @GetUser() user: any) {
    const order = await this.ordersService.findOne(id);
    return {
      success: true,
      message: 'Order retrieved successfully',
      data: { order },
    };
  }

  @Get('customer/:customerId')
  @HttpCode(HttpStatus.OK)
  async findByCustomerId(
    @Param('customerId') customerId: string,
    @GetUser() user: any,
  ) {
    const orders = await this.ordersService.findByCustomerId(customerId);
    return {
      success: true,
      message: 'Orders retrieved successfully',
      data: { orders },
    };
  }
}
