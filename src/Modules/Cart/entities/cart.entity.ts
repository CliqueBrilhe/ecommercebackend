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
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../User/entities/user.entity';
import { CartItem } from './cart-item.entity';

export type CartStatus = 'active' | 'converted' | 'abandoned';

@Entity({ name: 'carts' })
export class Cart {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID interno do carrinho' })
  id: number;

  @ManyToOne(() => User, (user) => user.carts, { onDelete: 'CASCADE' })
  @ApiProperty({ description: 'Usuário dono do carrinho' })
  user: User;

  @OneToMany(() => CartItem, (item) => item.cart, { cascade: true })
  @ApiProperty({ description: 'Itens presentes no carrinho' })
  items: CartItem[];

  @Column({
    type: 'enum',
    enum: ['active', 'converted', 'abandoned'],
    default: 'active',
  })
  @ApiProperty({
    description: 'Status atual do carrinho',
    enum: ['active', 'converted', 'abandoned'],
    default: 'active',
  })
  status: CartStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: 'Valor total dos produtos no carrinho' })
  total: number;

  @CreateDateColumn()
  @ApiProperty({ description: 'Data de criação do carrinho' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Data da última atualização do carrinho' })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 24/10/2025 - 21:40
- Criada entidade Cart (carrinho de compras)
- Relacionada a User e CartItem
--------------------------------------------
Explicação da lógica:
A entidade Cart representa o carrinho de compras de um usuário.
Pode estar ativo, abandonado ou convertido em pedido. Armazena os itens
e o valor total dos produtos adicionados antes da finalização.
by: gabbu (github: gabriellesote) ✧
*/
