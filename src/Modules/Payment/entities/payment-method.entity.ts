// src/Modules/Payment/entities/payment-method.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Payment } from './payment.entity';

@Entity({ name: 'payment_methods' })
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID interno da forma de pagamento' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ description: 'ID correspondente da forma de pagamento no Bling ERP' })
  blingId: number;

  @Column()
  @ApiProperty({ description: 'Descrição da forma de pagamento (ex: PIX, Boleto, Cartão)' })
  description: string;

  @Column()
  @ApiProperty({ description: 'Tipo fiscal de pagamento definido pelo Bling (ex: 20 = PIX, 15 = Boleto)' })
  paymentType: number;

  @Column({ default: 1 })
  @ApiProperty({ description: 'Situação do método (1 = ativo, 0 = inativo)' })
  status: number;

  @Column({ default: false })
  @ApiProperty({ description: 'Indica se a forma é fixa (criada internamente no Bling)' })
  fixed: boolean;

  @Column({ default: false })
  @ApiProperty({ description: 'Indica se é o método padrão configurado no Bling' })
  defaultMethod: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Finalidade do método (ex: 2 = venda, 3 = compra)' })
  purpose: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: 'Percentual de juros padrão aplicado pelo método', example: 0 })
  interest: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: 'Percentual de multa padrão aplicado pelo método', example: 0 })
  fine: number;

  @OneToMany(() => Payment, (payment) => payment.paymentMethod)
  @ApiProperty({ description: 'Pagamentos associados a esta forma de pagamento' })
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 23/10/2025 - 22:30
- Criada entidade PaymentMethod compatível com a API do Bling (/formas-pagamentos)
- Campos mapeados: id, descricao, tipoPagamento, situacao, fixa, padrao, finalidade, juros, multa
--------------------------------------------
Explicação da lógica:
A entidade PaymentMethod armazena localmente as formas de pagamento disponíveis no Bling ERP.
Esses registros são sincronizados periodicamente para permitir que o sistema exiba opções
de pagamento atualizadas sem depender da API do Bling em tempo real.
Cada PaymentMethod pode estar vinculado a múltiplos pagamentos reais (Payment).
by: gabbu (github: gabriellesote) ✧
*/
