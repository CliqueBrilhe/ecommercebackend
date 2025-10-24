// src/Modules/Invoice/entities/invoice.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../User/entities/user.entity';
import { Order } from '../../Order/entities/order.entity';

export type InvoiceStatus =
  | 'authorized'
  | 'cancelled'
  | 'denied'
  | 'pending'
  | 'error';

@Entity({ name: 'invoices' })
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  blingId?: number;

  @OneToOne(() => Order, (order) => order.invoice, { lazy: true })
  @JoinColumn()
  order: Promise<Order>;

  @ManyToOne(() => User, (user) => user.invoices, { lazy: true })
  user: Promise<User>;

  @Column({ nullable: true })
  number?: string;

  @Column({ nullable: true })
  serie?: string;

  @Column({ nullable: true })
  accessKey?: string;

  @Column({
    type: 'enum',
    enum: ['authorized', 'cancelled', 'denied', 'pending', 'error'],
    default: 'pending',
  })
  status: InvoiceStatus;

  @Column({ nullable: true })
  xmlUrl?: string;

  @Column({ nullable: true })
  pdfUrl?: string;

  @Column({ type: 'timestamp', nullable: true })
  issuedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 02:10
- Removidos todos os decorators do Swagger (@ApiProperty, @ApiHideProperty)
- Mantida estrutura e relacionamentos intactos (Order e User)
--------------------------------------------
Explicação da lógica:
A entidade Invoice representa notas fiscais eletrônicas associadas a pedidos e usuários.
Ela armazena informações fiscais, status e links para XML e PDF do documento.
Remover o Swagger evita dependências circulares e melhora a estabilidade da documentação.
by: gabbu (github: gabriellesote) ✧
*/
