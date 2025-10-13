import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// Boa prática: usar caminhos relativos para importações dentro do seu projeto
import { Categoria } from 'src/categoria/categoria.entity';

@Entity({ name: 'produto' }) // É uma boa prática nomear a tabela no plural
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

  /**
   * CORREÇÃO AQUI:
   * 'simple-array' salva o array como uma string separada por vírgulas.
   * Isso garante compatibilidade entre PostgreSQL e SQLite.
   * O TypeORM cuida da conversão de string para array (e vice-versa) para você.
   */
  @Column('simple-array', { nullable: false, default: '' })
  imagens: string[];

  @Column('text')
  descricao: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.produto, {
    nullable: true, // Um produto pode não ter categoria
    eager: true, // Carrega a categoria junto com o produto
  })
  categoria: Categoria;
}