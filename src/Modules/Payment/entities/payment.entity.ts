// src/Modules/Payment/entities/payment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../User/entities/user.entity';
import { Order } from '../../Order/entities/order.entity';
import { PaymentMethod } from './payment-method.entity';

export type PaymentStatus =
  | 'pending'
  | 'approved'
  | 'refused'
  | 'refunded'
  | 'cancelled';

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  blingId?: number;

  @ManyToOne(() => User, (user) => user.payments, { lazy: true })
  user: Promise<User>;

  @ManyToOne(() => Order, (order) => order.payments, { lazy: true })
  order: Promise<Order>;

  @ManyToOne(() => PaymentMethod, (method) => method.payments, { lazy: true })
  paymentMethod: Promise<PaymentMethod>;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'refused', 'refunded', 'cancelled'],
    default: 'pending',
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ nullable: true })
  paymentLink?: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 24/10/2025 - 23:50
- Removidos decorators do Swagger (ApiProperty, ApiHideProperty)
- Mantida a estrutura ORM e lazy loading
--------------------------------------------
Explicação da lógica:
Entidade Payment representa um pagamento vinculado a um pedido,
com usuário, método e dados de status. Agora sem Swagger.
by: gabbu (github: gabriellesote) ✧
*/
