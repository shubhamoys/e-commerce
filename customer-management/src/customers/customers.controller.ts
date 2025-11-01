import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Customer } from './entities/customer.entity';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('orders')
  @HttpCode(HttpStatus.OK)
  async getOrderHistory(@GetUser() user: Customer) {
    const orders = await this.customersService.getOrderHistory(user.id);
    return {
      success: true,
      message: 'Order history retrieved successfully',
      data: { orders },
    };
  }
}
