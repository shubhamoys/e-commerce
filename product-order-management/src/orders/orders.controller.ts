import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  ForbiddenException,
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
    const order = await this.ordersService.create(createOrderDto, user);
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

    // Verify the order belongs to the authenticated user
    if (order.customerId !== user.id) {
      throw new ForbiddenException('You are not authorized to view this order');
    }

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
