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
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: 'ID interno da nota fiscal' })
  id: number;

  @Column({ unique: true, nullable: true })
  @ApiProperty({ description: 'ID da nota fiscal no Bling ERP', required: false })
  blingId?: number;

  @OneToOne(() => Order, (order) => order.invoice)
  @JoinColumn()
  @ApiProperty({ description: 'Pedido associado a esta nota fiscal' })
  order: Order;

  @ManyToOne(() => User, (user) => user.invoices)
  @ApiProperty({ description: 'Usuário (cliente) associado à nota fiscal' })
  user: User;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Número da nota fiscal (NFe/NFCe)', example: '000123' })
  number?: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Série da nota fiscal', example: '1' })
  serie?: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Chave de acesso da nota fiscal', example: '35241123456789000123550010000012341123456789' })
  accessKey?: string;

  @Column({
    type: 'enum',
    enum: ['authorized', 'cancelled', 'denied', 'pending', 'error'],
    default: 'pending',
  })
  @ApiProperty({
    description: 'Status atual da nota fiscal',
    enum: ['authorized', 'cancelled', 'denied', 'pending', 'error'],
    default: 'pending',
  })
  status: InvoiceStatus;

  @Column({ nullable: true })
  @ApiProperty({ description: 'URL do arquivo XML da nota fiscal no Bling', required: false })
  xmlUrl?: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'URL do PDF/DANFE da nota fiscal no Bling', required: false })
  pdfUrl?: string;

  @Column({ type: 'timestamp', nullable: true })
  @ApiProperty({ description: 'Data e hora da emissão da nota fiscal', required: false })
  issuedAt?: Date;

  @CreateDateColumn()
  @ApiProperty({ description: 'Data de criação do registro da nota fiscal' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Data da última atualização do registro da nota fiscal' })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 24/10/2025 - 01:45
- Criada entidade Invoice compatível com Bling (NFC-e)
- Relacionada com User (cliente) e Order (pedido)
- Incluídos campos fiscais: número, série, chave de acesso, status, urls e data de emissão
--------------------------------------------
Explicação da lógica:
A entidade Invoice representa a nota fiscal eletrônica (NFC-e) emitida a partir de um pedido.
Cada nota pertence a um usuário (cliente) e a um pedido específico. Os campos armazenam
dados retornados pelo Bling, permitindo consultas e verificações fiscais locais.
by: gabbu (github: gabriellesote) ✧
*/
