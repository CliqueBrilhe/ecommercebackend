// src/product/product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../categoria/categoria.entity';

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

  @Column({ default: false })
  synchronized: boolean;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração de nomenclaturas para inglês (entity, campos, variáveis e relacionamentos)
// --------------------------------------------------------------
// Explicação da lógica:
// Esta entity representa os produtos do e-commerce, armazenando informações como código, nome,
// preço, estoque, dimensões, imagens, descrição, categoria associada e status de sincronização
// com o Bling. Os campos updatedAt e createdAt são gerenciados automaticamente pelo TypeORM.
// by: gabbu (github: gabriellesote)
