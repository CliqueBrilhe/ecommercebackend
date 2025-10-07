import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// Transformer universal para garantir que valores do DB (lidos como string)
// sejam convertidos para Number (float) no NestJS.
const numberTransformer = {
  from: (v: string | number) => v === null ? null : parseFloat(v as string),
  to: (v: number | null) => v,
};

@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  codigo: string;

  @Column()
  nome: string;

  // CORREÇÃO 1: Usando 'integer' explícito para melhor compatibilidade com contadores.
  @Column('integer', { default: 0 }) 
  quantidadeEstoque: number;

  // CORREÇÃO 2: Aplicando o transformer para garantir que o DECIMAL seja lido como número.
  @Column('decimal', { precision: 10, scale: 2, transformer: numberTransformer })
  preco: number;

  @Column('integer', { default: 0 })
  promocao: number; // % de desconto

  // Aplicando o transformer em todas as dimensões decimais para segurança.
  @Column('decimal', { precision: 5, scale: 2, transformer: numberTransformer })
  largura: number;

  @Column('decimal', { precision: 5, scale: 2, transformer: numberTransformer })
  altura: number;

  @Column('decimal', { precision: 5, scale: 2, transformer: numberTransformer })
  profundidade: number;

  @Column('text', { array: true, nullable: false, default: () => "'{}'" })
  imagens: string[];

  @Column('text')
  descricao: string;
  
  @Column({ nullable: true })
  categoria: string;
}
