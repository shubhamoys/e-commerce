import {
  Entity,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { CartItem } from './cart-item.entity';

@Entity('cart')
export class Cart extends BaseEntity {
  @Column({ type: 'uuid', unique: true, name: 'customer_id' })
  @Index()
  customerId: string;

  @OneToOne(() => Customer, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
    eager: true,
  })
  items: CartItem[];
}
