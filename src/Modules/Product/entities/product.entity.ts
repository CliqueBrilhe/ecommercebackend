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
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID do produto' })
  id: number;

  @Column({ type: 'bigint', name: 'bling_id', nullable: true, unique: true })
  @ApiProperty({ description: 'ID do produto no Bling', required: false })
  blingId: number | null;

  @Column({ unique: true })
  @ApiProperty({ description: 'Código único do produto' })
  code: string;

  @Column()
  @ApiProperty({ description: 'Nome do produto' })
  name: string;

  @Column('int', { name: 'stock_quantity' })
  @ApiProperty({ description: 'Quantidade em estoque' })
  stockQuantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  @ApiProperty({ description: 'Preço do produto' })
  price: number;

  @Column({ type: 'int', default: 0 })
  @ApiProperty({ description: 'Estoque real disponível', default: 0 })
  stock: number; 

  @Column('int', { default: 0 })
  @ApiProperty({ description: 'Percentual de promoção', default: 0 })
  promotion: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  @ApiProperty({ description: 'Largura do produto', required: false })
  width: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  @ApiProperty({ description: 'Altura do produto', required: false })
  height: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  @ApiProperty({ description: 'Profundidade do produto', required: false })
  depth: number;

  @Column('simple-array', { nullable: false, default: '' })
  @ApiProperty({ description: 'URLs das imagens do produto', type: [String], default: [] })
  images: string[];

  @Column('text', { nullable: true })
  @ApiProperty({ description: 'Descrição do produto', required: false })
  description: string;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    eager: true,
  })
  @ApiProperty({ description: 'Categoria do produto', required: false, type: () => Category })
  category?: Category;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  @ApiProperty({ description: 'Itens de carrinho que incluem este produto' })
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  @ApiProperty({ description: 'Itens de pedido que incluem este produto' })
  orderItems: OrderItem[];

  @OneToMany(() => WishlistItem, (wishlistItem) => wishlistItem.product)
  @ApiProperty({ description: 'Listas de desejos que contêm este produto' })
  wishlistItems: WishlistItem[];

  @OneToMany(() => Review, (review) => review.product)
  @ApiProperty({ description: 'Avaliações associadas a este produto' })
  reviews: Review[];

  @Column({ default: false })
  @ApiProperty({ description: 'Indica se o produto foi sincronizado com o Bling', default: false })
  synchronized: boolean;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'active',
  })
  @ApiProperty({
    description: 'Status do produto (active, to_verify, inactive)',
    enum: ['active', 'to_verify', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'to_verify' | 'inactive';

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: 'Data da última atualização', readOnly: true })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'Data de criação do produto', readOnly: true })
  createdAt: Date;
}

/*
Histórico de alterações:
Edição: 25/10/2025 - 01:00
- Adicionados relacionamentos com CartItem, OrderItem, WishlistItem e Review
--------------------------------------------
Explicação da lógica:
A entidade Product representa os produtos disponíveis no e-commerce e sincronizados com o Bling ERP.
Agora se conecta também com itens de carrinho, pedidos, listas de desejos e avaliações,
permitindo rastrear o ciclo completo do produto desde o interesse até a compra e feedback do cliente.
by: gabbu (github: gabriellesote) ✧
*/
