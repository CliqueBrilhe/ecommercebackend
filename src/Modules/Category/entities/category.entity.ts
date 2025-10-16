import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../Product/entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID da categoria' })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  @ApiProperty({ description: 'Nome da categoria' })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ description: 'Caminho ou slug da categoria', required: false, nullable: true })
  path: string;

  @Column({ type: 'integer', default: 0 })
  @ApiProperty({ description: 'Ordem de exibição da categoria', default: 0 })
  order: number;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  @ApiProperty({ description: 'Categoria pai', required: false, nullable: true, type: () => Category })
  parent?: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  @ApiProperty({ description: 'Subcategorias (children)', type: () => [Category] })
  children: Category[];

  @OneToMany(() => Product, (product) => product.category)
  @ApiProperty({ description: 'Produtos associados a esta categoria', type: () => [Product] })
  products: Product[];

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({ description: 'Data de criação da categoria', readOnly: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @ApiProperty({ description: 'Data da última atualização da categoria', readOnly: true })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 15/10/2025 
// Refatoração de nomenclaturas para inglês (entity, campos, relacionamentos e arrays)

16/10/2025
2. Adicionados decorators do Swagger (@ApiProperty) para documentação de todos os campos da Category
--------------------------------------------
Explicação da lógica:
Esta entity representa categorias de produtos, permitindo hierarquia pai-filho.
Cada categoria pode ter produtos associados e subcategorias (children).
Campos createdAt e updatedAt são gerenciados automaticamente pelo TypeORM.
by: gabbu (github: gabriellesote)
*/
