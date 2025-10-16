// src/order/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../Product/entities/product.entity';
import { User } from '../../User/entities/user.entity';

export type OrderStatus = 'under_review' | 'approved' | 'rejected';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product)
  @JoinColumn()
  product: Product;

  @Column('int')
  quantity: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  productValue: number;

  @Column('decimal', { precision: 10, scale: 2 })
  shippingValue: number;

  @Column({
    type: 'simple-enum',
    enum: ['under_review', 'approved', 'rejected'],
    default: 'under_review',
  })
  status: OrderStatus;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração de nomenclaturas para inglês (entity, campos e tipos)
// --------------------------------------------------------------
// Explicação da lógica:
// Entidade que representa um pedido, relacionando produto e usuário,
// com campos de quantidade, valor do produto, valor do frete, status
// e data de criação.
// by: gabbu (github: gabriellesote)
