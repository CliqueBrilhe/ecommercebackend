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

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  data: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  valorProduto: number;

  @Column('decimal', { precision: 10, scale: 2 })
  valorFrete: number;

  @Column({ type: 'enum', enum: ['em análise', 'aprovado', 'reprovado'], default: 'em análise' })
  status: StatusPedido;

  @ManyToOne(() => Usuario)
  @JoinColumn()
  usuario: Usuario;
}
