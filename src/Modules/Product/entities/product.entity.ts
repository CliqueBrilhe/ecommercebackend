import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../Category/entities/category.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID do produto' })
  id: number;

  @Column({ type: 'bigint', name: 'bling_id', nullable: true, unique: true })
  @ApiProperty({ description: 'ID do produto no Bling', required: false, nullable: true })
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
  @ApiProperty({ description: 'Largura do produto', required: false, nullable: true })
  width: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  @ApiProperty({ description: 'Altura do produto', required: false, nullable: true })
  height: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  @ApiProperty({ description: 'Profundidade do produto', required: false, nullable: true })
  depth: number;

  @Column('simple-array', { nullable: false, default: '' })
  @ApiProperty({ description: 'URLs das imagens do produto', type: [String], default: [] })
  images: string[];

  @Column('text', { nullable: true })
  @ApiProperty({ description: 'Descrição do produto', required: false, nullable: true })
  description: string;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
    eager: true,
  })
  @ApiProperty({ description: 'Categoria do produto', required: false, type: () => Category })
  category?: Category;

  @Column({ default: false })
  @ApiProperty({ description: 'Indica se o produto foi sincronizado com o Bling', default: false })
  synchronized: boolean;


  // 👇 novo campo
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
Edição: 15/10/2025 
// Refatoração de nomenclaturas para inglês (entity, campos, relacionamentos e arrays)

1. 16/10/2025
2. Adicionados decorators do Swagger (@ApiProperty) para documentação de todos os campos do Product
--------------------------------------------
Explicação da lógica:
Esta entity representa os produtos do e-commerce, armazenando informações como código, nome,
preço, estoque, dimensões, imagens, descrição, categoria associada e status de sincronização
com o Bling. Os campos updatedAt e createdAt são gerenciados automaticamente pelo TypeORM.
by: gabbu (github: gabriellesote)
*/
