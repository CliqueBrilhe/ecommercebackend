import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Produto } from '../produto/produto.entity';
import { Usuario } from '../usuario/usuario.entity';

export type StatusPedido = 'em análise' | 'aprovado' | 'reprovado';

@Entity()
export class Pedido {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Produto)
  @JoinColumn()
  produto: Produto;

  @Column('int')
  quantidade: number;

  // CORREÇÃO 1: 'timestamp' não é suportado pelo SQLite.
  // Usamos 'text' para armazenar a data como string ISO 8601, compatível com ambos.
  // A função padrão (default) garante que o valor seja salvo na criação.
  @Column('text', { default: () => 'CURRENT_TIMESTAMP' })
  data: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  valorProduto: number;

  @Column('decimal', { precision: 10, scale: 2 })
  valorFrete: number;

  // CORREÇÃO 2: 'enum' não é suportado pelo SQLite.
  // Usamos 'text' para o tipo de coluna no DB, mas mantemos o 'enum' para validação do TypeORM.
  @Column({ 
    type: 'text', 
    enum: ['em análise', 'aprovado', 'reprovado'], 
    default: 'em análise' 
  })
  status: StatusPedido;

  @ManyToOne(() => Usuario)
  @JoinColumn()
  usuario: Usuario;
}
