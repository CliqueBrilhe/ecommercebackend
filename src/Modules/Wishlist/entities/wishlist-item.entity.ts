// src/Modules/Wishlist/entities/wishlist-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../../User/entities/user.entity';
import { Product } from '../../Product/entities/product.entity';

@Entity({ name: 'wishlist_items' })
@Unique(['user', 'product'])
export class WishlistItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 04:30
- Removidos todos os decorators do Swagger (@ApiProperty)
--------------------------------------------
Explicação da lógica:
A entidade WishlistItem representa um produto salvo na lista de desejos de um usuário,
com chave composta (user + product) para evitar duplicações.
by: gabbu (github: gabriellesote) ✧
*/
