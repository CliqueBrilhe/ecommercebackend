// src/Modules/Order/entities/order-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../Product/entities/product.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product)
  product: Product;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}

/*
Histórico de alterações:
Edição: 25/10/2025 - 00:45
- Removidos decorators do Swagger (ApiProperty)
- Mantida a estrutura ORM completa e relacionamento bidirecional
--------------------------------------------
Explicação da lógica:
A entidade OrderItem representa os produtos associados a um pedido.
Ela mantém o vínculo com o pedido e o produto e armazena quantidade,
preço e subtotal, usados no cálculo do valor total do pedido.
by: gabbu (github: gabriellesote) ✧
*/
