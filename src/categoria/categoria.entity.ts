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

  /**
   * Materialized path. Armazena o caminho completo da categoria.
   * Ex: a categoria 'Sapatos' (id 3), filha de 'Calçados' (id 1), teria o path '1/3'.
   * Facilita a busca por todos os produtos de uma categoria e suas subcategorias.
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  path: string;

  /**
   * Ordem de exibição da categoria, definida pelo administrador.
   */
  @Column({ type: 'integer', default: 0 })
  ordem: number;

  /**
   * Relacionamento com a própria entidade para definir a categoria pai.
   * Uma categoria pode não ter pai (será uma categoria raiz).
   * Se um pai for deletado, o filho se torna uma categoria raiz (onDelete: 'SET NULL').
   */
  @ManyToOne(() => Categoria, (categoria) => categoria.children, {
    nullable: true,
    onDelete: 'SET NULL', // Importante para não deletar filhos em cascata
  })
  @JoinColumn({ name: 'parent_id' }) // Define o nome da coluna do FK
  parent: Categoria;

  /**
   * Relacionamento para acessar todas as subcategorias diretas.
   */
  @OneToMany(() => Categoria, (categoria) => categoria.parent)
  children: Categoria[];

  /**
   * Relacionamento para acessar todos os produtos desta categoria.
   */
  @OneToMany(() => Produto, (produto) => produto.categoria)
  produto: Produto[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
