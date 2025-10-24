// src/Modules/Cart/entities/cart-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../Product/entities/product.entity';

@Entity({ name: 'cart_items' })
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

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
Edição: 26/10/2025 - 03:30
- Removidos todos os decorators do Swagger
--------------------------------------------
Explicação da lógica:
A entidade CartItem representa cada produto presente no carrinho,
com quantidade, preço e subtotal calculado automaticamente.
by: gabbu (github: gabriellesote) ✧
*/
