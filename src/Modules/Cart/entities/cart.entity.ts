// src/Modules/Cart/entities/cart.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../User/entities/user.entity';
import { CartItem } from './cart-item.entity';

export type CartStatus = 'active' | 'converted' | 'abandoned';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.carts, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  items: CartItem[];

  @Column({
    type: 'enum',
    enum: ['active', 'converted', 'abandoned'],
    default: 'active',
  })
  status: CartStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 03:30
- Removidos todos os decorators do Swagger (@ApiProperty)
--------------------------------------------
Explicação da lógica:
A entidade Cart representa o carrinho de compras de um usuário,
com status (ativo, convertido ou abandonado), total e itens associados.
by: gabbu (github: gabriellesote) ✧
*/
