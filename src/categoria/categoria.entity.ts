// src/categoria/categoria.entity.ts
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
import { Produto } from '../produto/produto.entity';

@Entity({ name: 'categoria' })
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  nome: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  path: string;

  @Column({ type: 'integer', default: 0 })
  ordem: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: Categoria;

  @OneToMany(() => Categoria, (categoria) => categoria.parent)
  children: Categoria[];

  @OneToMany(() => Produto, (produto) => produto.categoria)
  produto: Produto[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
