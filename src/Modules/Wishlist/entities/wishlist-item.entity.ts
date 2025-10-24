// src/Modules/Wishlist/entities/wishlist-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../User/entities/user.entity';
import { Product } from '../../Product/entities/product.entity';

@Entity({ name: 'wishlist_items' })
@Unique(['user', 'product'])
export class WishlistItem {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID interno do item da lista de desejos' })
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @ApiProperty({ description: 'Usuário dono da lista de desejos', type: () => User })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @ApiProperty({ description: 'Produto adicionado à lista de desejos', type: () => Product })
  product: Product;

  @CreateDateColumn()
  @ApiProperty({ description: 'Data em que o produto foi adicionado à lista' })
  createdAt: Date;
}

/*
Histórico de alterações:
Edição: 25/10/2025 - 00:15
- Criada entidade WishlistItem (lista de desejos)
- Relacionada a User e Product
--------------------------------------------
Explicação da lógica:
A entidade WishlistItem representa um produto salvo na lista de desejos de um usuário.
Serve para que o cliente possa marcar itens de interesse, sem realizar uma compra imediata.
by: gabbu (github: gabriellesote) ✧
*/
