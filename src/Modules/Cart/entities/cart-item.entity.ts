// src/Modules/Cart/entities/cart-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Cart } from './cart.entity';
import { Product } from '../../Product/entities/product.entity';

@Entity({ name: 'cart_items' })
export class CartItem {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID interno do item do carrinho' })
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @ApiProperty({ description: 'Carrinho ao qual o item pertence' })
  cart: Cart;

  @ManyToOne(() => Product)
  @ApiProperty({ description: 'Produto adicionado ao carrinho' })
  product: Product;

  @Column({ type: 'int', default: 1 })
  @ApiProperty({ description: 'Quantidade do produto no carrinho', example: 2 })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: 'Preço unitário do produto no momento da adição' })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: 'Subtotal (quantidade × preço)' })
  subtotal: number;
}

/*
Histórico de alterações:
Edição: 24/10/2025 - 21:45
- Criada entidade CartItem vinculada a Cart e Product
--------------------------------------------
Explicação da lógica:
A entidade CartItem representa os produtos dentro de um carrinho.
Cada item pertence a um carrinho e referencia um produto. Guarda
a quantidade, preço unitário e subtotal, base para cálculo do total do carrinho.
by: gabbu (github: gabriellesote) ✧
*/
