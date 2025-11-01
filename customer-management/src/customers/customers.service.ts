import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerOrder } from './entities/customer-order.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerOrder)
    private readonly customerOrderRepository: Repository<CustomerOrder>,
  ) {}

  async getOrderHistory(customerId: string) {
    const orders = await this.customerOrderRepository.find({
      where: { customerId },
      order: { orderDate: 'DESC' },
    });

    return orders;
  }
}
