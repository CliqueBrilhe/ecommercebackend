// src/Modules/Order/entities/order-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { Product } from '../../Product/entities/product.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID interno do item do pedido' })
  id: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @ApiProperty({ description: 'Pedido ao qual o item pertence' })
  order: Order;

  @ManyToOne(() => Product)
  @ApiProperty({ description: 'Produto associado ao item do pedido' })
  product: Product;

  @Column({ type: 'int', default: 1 })
  @ApiProperty({ description: 'Quantidade do produto no pedido', example: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: 'Preço unitário do produto no momento da compra' })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: 'Subtotal calculado (quantidade × preço)' })
  subtotal: number;
}

/*
Histórico de alterações:
Edição: 24/10/2025 - 17:15
- Criada entidade OrderItem vinculada ao pedido e produto
--------------------------------------------
Explicação da lógica:
A entidade OrderItem representa os produtos que compõem um pedido.
Cada item pertence a um pedido e referencia um produto, armazenando
a quantidade, preço unitário e subtotal. Serve de base para o cálculo
do valor total do pedido e emissão da nota fiscal.
by: gabbu (github: gabriellesote) ✧
*/
