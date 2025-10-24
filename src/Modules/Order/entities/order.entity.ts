// src/Modules/Order/entities/order.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../User/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../../Payment/entities/payment.entity';
import { Invoice } from '../../Invoice/entities/invoice.entity';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  blingId?: number;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order, {
    cascade: true,
    lazy: true,
  })
  payments: Promise<Payment[]>;

  @OneToOne(() => Invoice, (invoice) => invoice.order, { cascade: true })
  invoice?: Invoice;

  @Column({
    type: 'enum',
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ default: false })
  synchronized: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 24/10/2025 - 23:50
- Removidos decorators do Swagger (ApiProperty, ApiHideProperty)
- Mantida a lógica ORM e relacionamentos (user, items, payments, invoice)
--------------------------------------------
Explicação da lógica:
Entidade Order representa um pedido de venda completo.
A documentação Swagger foi removida para eliminar dependências circulares.
by: gabbu (github: gabriellesote) ✧
*/
