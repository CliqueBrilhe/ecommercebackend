// src/Modules/User/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Address } from '../../Address/entities/address.entity';
import { Cart } from '../../Cart/entities/cart.entity';
import { Order } from '../../Order/entities/order.entity';
import { Invoice } from '../../Invoice/entities/invoice.entity';
import { Payment } from '../../Payment/entities/payment.entity'; // ✅ novo import

export type UserType = 'admin' | 'common';
export type UserStatus = 'active' | 'inactive' | 'deleted' | 'no_activity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID do usuário' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Nome completo do usuário' })
  name: string;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: 'Data e hora do último login do usuário', required: false })
  lastLoginAt?: Date;

  @Column({ unique: true })
  @ApiProperty({ description: 'CPF do usuário' })
  cpf: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'E-mail do usuário' })
  email: string;

  @Column()
  @ApiProperty({ description: 'Telefone de contato do usuário' })
  phone: string;

  @Column()
  @ApiProperty({ description: 'Senha criptografada do usuário' })
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'common'],
    default: 'common',
  })
  @ApiProperty({ description: 'Tipo de usuário no sistema', enum: ['admin', 'common'], default: 'common' })
  userType: UserType;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'deleted', 'no_activity'],
    default: 'active',
  })
  @ApiProperty({
    description: 'Status atual do usuário',
    enum: ['active', 'inactive', 'deleted', 'no_activity'],
    default: 'active',
  })
  status: UserStatus;

  @Column({ nullable: true })
  @ApiProperty({ description: 'ID correspondente ao cliente no Bling ERP', required: false })
  blingId?: number;

  @Column({ default: false })
  @ApiProperty({ description: 'Indica se o usuário já foi sincronizado com o Bling ERP' })
  synchronized: boolean;

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  @ApiProperty({ description: 'Lista de endereços associados ao usuário' })
  addresses: Address[];

  @OneToMany(() => Cart, (cart) => cart.user, { cascade: true })
  @ApiProperty({ description: 'Carrinhos de compras criados pelo usuário' })
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.user, { cascade: true })
  @ApiProperty({ description: 'Pedidos realizados pelo usuário' })
  orders: Order[];

  @OneToMany(() => Invoice, (invoice) => invoice.user, { cascade: true })
  @ApiProperty({ description: 'Notas fiscais emitidas em nome do usuário' })
  invoices: Invoice[];

  @OneToMany(() => Payment, (payment) => payment.user, { cascade: true })
  @ApiProperty({ description: 'Pagamentos realizados pelo usuário' })
  payments: Payment[];

  @CreateDateColumn()
  @ApiProperty({ description: 'Data de criação do registro do usuário' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Data da última atualização do registro do usuário' })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 23/10/2025 - 20:45
- Adicionado relacionamento com Payment (1:N)
- Corrigidos e padronizados todos os decorators @ApiProperty
- Import da entidade Payment
--------------------------------------------
Explicação da lógica:
A entidade User representa clientes e administradores do sistema Clique e Brilhe.
Possui relacionamentos diretos com Address, Cart, Order, Invoice e Payment.
Cada usuário pode ter múltiplos endereços, pedidos, notas fiscais e pagamentos,
centralizando toda a jornada comercial e garantindo integridade fiscal e
sincronização com o Bling ERP.
by: gabbu (github: gabriellesote) ✧
*/
