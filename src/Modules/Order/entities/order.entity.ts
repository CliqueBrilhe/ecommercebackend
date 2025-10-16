// src/Modules/Order/entities/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../Product/entities/product.entity';
import { User } from '../../User/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export type OrderStatus = 'under_review' | 'approved' | 'rejected';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID do pedido' })
  id: number;

  @ManyToOne(() => Product)
  @JoinColumn()
  @ApiProperty({ description: 'Produto associado ao pedido', type: () => Product })
  product: Product;

  @Column('int')
  @ApiProperty({ description: 'Quantidade do produto no pedido' })
  quantity: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'Data do pedido', readOnly: true })
  date: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  @ApiProperty({ description: 'Valor do produto no pedido' })
  productValue: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @ApiProperty({ description: 'Valor do frete do pedido' })
  shippingValue: number;

  @Column({
    type: 'simple-enum',
    enum: ['under_review', 'approved', 'rejected'],
    default: 'under_review',
  })
  @ApiProperty({ description: 'Status do pedido', enum: ['under_review', 'approved', 'rejected'], default: 'under_review' })
  status: OrderStatus;

  @ManyToOne(() => User)
  @JoinColumn()
  @ApiProperty({ description: 'Usuário que fez o pedido', type: () => User })
  user: User;
}

/*
Histórico de alterações:
Edição: 15/10/2025 
- Refatoração de nomenclaturas para inglês (entity, campos e tipos)
Edição: 16/10/2025
- Adicionados decorators do Swagger (@ApiProperty) para documentação de todos os campos
--------------------------------------------
Explicação da lógica:
Entidade que representa um pedido, relacionando produto e usuário,
com campos de quantidade, valor do produto, valor do frete, status
e data de criação.
by: gabbu (github: gabriellesote)
*/
