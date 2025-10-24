// src/Modules/Product/entities/product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../Category/entities/category.entity';
import { CartItem } from '../../Cart/entities/cart-item.entity';
import { OrderItem } from '../../Order/entities/order-item.entity';
import { WishlistItem } from '../../Wishlist/entities/wishlist-item.entity';
import { Review } from '../../Review/entities/review.entity';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', name: 'bling_id', nullable: true, unique: true })
  blingId: number | null;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column('int', { name: 'stock_quantity' })
  stockQuantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column('int', { default: 0 })
  promotion: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  width: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  height: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  depth: number;

  @Column('simple-array', { nullable: false, default: '' })
  images: string[];

  @Column('text', { nullable: true })
  description: string;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    eager: true,
  })
  category?: Category;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => WishlistItem, (wishlistItem) => wishlistItem.product)
  wishlistItems: WishlistItem[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @Column({ default: false })
  synchronized: boolean;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'active',
  })
  status: 'active' | 'to_verify' | 'inactive';

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 01:15
- Removidos todos os decorators do Swagger
- Mantida estrutura ORM completa e relacionamentos
--------------------------------------------
Explicação da lógica:
A entidade Product representa os produtos do e-commerce integrados com o Bling ERP.
Armazena informações detalhadas de estoque, preço, dimensões e promoções.
Remover o Swagger elimina dependências circulares e melhora a clareza da modelagem.
by: gabbu (github: gabriellesote) ✧
*/
