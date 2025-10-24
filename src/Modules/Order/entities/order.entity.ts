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
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'ID interno do pedido' })
  id: number;

  @Column({ unique: true, nullable: true })
  @ApiProperty({ description: 'ID do pedido no Bling ERP', required: false })
  blingId?: number;

  @ManyToOne(() => User, (user) => user.orders)
  @ApiProperty({ description: 'Usuário que realizou o pedido' })
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  @ApiProperty({ description: 'Itens do pedido' })
  items: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order, { cascade: true })
  @ApiProperty({ description: 'Pagamentos associados ao pedido' })
  payments: Payment[];

  @OneToOne(() => Invoice, (invoice) => invoice.order, { cascade: true })
  @ApiProperty({ description: 'Nota fiscal gerada para o pedido', required: false })
  invoice?: Invoice;

  @Column({ type: 'enum', enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' })
  @ApiProperty({
    description: 'Status atual do pedido',
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: 'Valor total do pedido' })
  totalAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: 'Valor do frete' })
  shippingCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: 'Desconto aplicado no pedido' })
  discount: number;

  @Column({ default: false })
  @ApiProperty({ description: 'Indica se o pedido já foi sincronizado com o Bling ERP' })
  synchronized: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: 'Data de criação do pedido' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Data da última atualização do pedido' })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 24/10/2025 - 17:10
- Criada entidade Order integrada ao fluxo Bling (pedidos de venda)
- Relacionada a User, OrderItem, Payment e Invoice
- Adicionados campos fiscais e financeiros
--------------------------------------------
Explicação da lógica:
A entidade Order representa o pedido confirmado de um usuário.
Conecta-se ao usuário comprador, aos itens do pedido, aos pagamentos
e à nota fiscal emitida. É a base para sincronização de pedidos de venda no Bling ERP.
by: gabbu (github: gabriellesote) ✧
*/
