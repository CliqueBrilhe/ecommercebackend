// src/Modules/Payment/entities/payment.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'ID interno do pagamento' })
  id: number;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'ID correspondente ao pagamento no Bling ERP',
    required: false,
  })
  blingId?: number;

  @ManyToOne(() => User, (user) => user.payments)
  @ApiProperty({
    description: 'Usuário que realizou o pagamento',
    type: () => User,
  })
  user: User;

 @ManyToOne(() => Order, (order) => order.payments)
@ApiHideProperty() // 🔥 evita loop circular no Swagger
order: Order;


  @ManyToOne(() => PaymentMethod, (method) => method.payments)
  @ApiProperty({
    description: 'Forma de pagamento utilizada',
    type: () => PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: 'Valor total pago', example: 199.9 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'refused', 'refunded', 'cancelled'],
    default: 'pending',
  })
  @ApiProperty({
    description: 'Status atual do pagamento',
    enum: ['pending', 'approved', 'refused', 'refunded', 'cancelled'],
    default: 'pending',
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  @ApiProperty({
    description:
      'Identificador da transação no gateway de pagamento (ex: Mercado Pago)',
  })
  transactionId?: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: 'Link de pagamento (boleto, PIX ou checkout externo)',
  })
  paymentLink?: string;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({
    description: 'Data e hora da confirmação do pagamento',
    required: false,
  })
  paidAt?: Date;

  @CreateDateColumn()
  @ApiProperty({ description: 'Data de criação do registro de pagamento' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    description: 'Data da última atualização do registro de pagamento',
  })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 23/10/2025 - 22:30
- Criada entidade Payment com integração direta a User, Order e PaymentMethod
- Adicionados campos compatíveis com gateways (transactionId, paymentLink, paidAt)
- Incluído campo blingId para sincronização com o ERP Bling
--------------------------------------------
Explicação da lógica:
A entidade Payment representa um pagamento real realizado por um usuário.
Cada pagamento pertence a um pedido (Order) e utiliza uma forma de pagamento (PaymentMethod).
Ela é usada para registrar e sincronizar os pagamentos confirmados com o ERP Bling.
O campo status permite acompanhar o ciclo de vida do pagamento: pendente, aprovado, recusado, etc.
by: gabbu (github: gabriellesote) ✧
*/
