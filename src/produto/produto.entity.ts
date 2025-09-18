import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  codigo: string;

  @Column()
  nome: string;

  @Column('int')
  quantidadeEstoque: number;

  @Column('decimal', { precision: 10, scale: 2 })
  preco: number;

  @Column('int', { default: 0 })
  promocao: number; // % de desconto

  @Column('decimal', { precision: 5, scale: 2 })
  largura: number;

  @Column('decimal', { precision: 5, scale: 2 })
  altura: number;

  @Column('decimal', { precision: 5, scale: 2 })
  profundidade: number;

  @Column('text', { array: true, nullable: true })
  imagens: string[];

  @Column('text')
  descricao: string;
}