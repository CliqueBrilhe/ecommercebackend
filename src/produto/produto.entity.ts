// src/produto/produto.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Categoria } from '../categoria/categoria.entity';

@Entity({ name: 'produto' })
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', name: 'bling_id', nullable: true, unique: true })
  blingId: number | null;

  @Column({ unique: true })
  codigo: string;

  @Column()
  nome: string;

  @Column('int', { name: 'quantidade_estoque' })
  quantidadeEstoque: number;

  @Column('decimal', { precision: 10, scale: 2 })
  preco: number;

  @Column('int', { default: 0 })
  promocao: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  largura: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  altura: number;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  profundidade: number;

  @Column('simple-array', { nullable: false, default: '' })
  imagens: string[];

  @Column('text', { nullable: true })
  descricao: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.produto, {
    nullable: true,
    eager: true,
  })
  categoria?: Categoria;

  @Column({ default: false })
  sincronizado: boolean;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizadoEm: Date;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;
}
