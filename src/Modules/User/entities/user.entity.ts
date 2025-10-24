// src/Modules/User/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Address } from '../../Address/entities/address.entity';
import { Cart } from '../../Cart/entities/cart.entity';
import { Order } from '../../Order/entities/order.entity';
import { Invoice } from '../../Invoice/entities/invoice.entity';
import { Payment } from '../../Payment/entities/payment.entity';
import { WishlistItem } from '../../Wishlist/entities/wishlist-item.entity';
import { Review } from '../../Review/entities/review.entity';

export type UserType = 'admin' | 'common';
export type UserStatus = 'active' | 'inactive' | 'deleted' | 'no_activity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @Column({ unique: true })
  cpf: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'common'],
    default: 'common',
  })
  userType: UserType;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'deleted', 'no_activity'],
    default: 'active',
  })
  status: UserStatus;

  @Column({ nullable: true })
  blingId?: number;

  @Column({ default: false })
  synchronized: boolean;

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];

  @OneToMany(() => Cart, (cart) => cart.user, { cascade: true })
  carts: Cart[];

  @OneToMany(() => Order, (order) => order.user, { cascade: true })
  orders: Order[];

  @OneToMany(() => Invoice, (invoice) => invoice.user, { cascade: true })
  invoices: Invoice[];

  @OneToMany(() => Payment, (payment) => payment.user, { cascade: true })
  payments: Payment[];

  @OneToMany(() => WishlistItem, (item) => item.user, { cascade: true })
  wishlistItems?: WishlistItem[];

  @OneToMany(() => Review, (review) => review.user, { cascade: true })
  reviews?: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 25/10/2025 - 00:35
- Removidos todos os decorators do Swagger (ApiProperty)
- Mantida a estrutura ORM completa com relacionamentos
--------------------------------------------
Explicação da lógica:
A entidade User representa clientes e administradores, com todos os vínculos
de pedidos, pagamentos, endereços, avaliações e lista de desejos.
Remover os decorators Swagger elimina riscos de dependência circular.
by: gabbu (github: gabriellesote) ✧
*/
