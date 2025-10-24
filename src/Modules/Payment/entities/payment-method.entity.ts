// src/Modules/Payment/entities/payment-method.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Payment } from './payment.entity';

@Entity({ name: 'payment_methods' })
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  blingId: number;

  @Column()
  description: string;

  @Column()
  paymentType: number;

  @Column({ default: 1 })
  status: number;

  @Column({ default: false })
  fixed: boolean;

  @Column({ default: false })
  defaultMethod: boolean;

  @Column({ nullable: true })
  purpose: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  interest: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fine: number;

  @OneToMany(() => Payment, (payment) => payment.paymentMethod)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 00:55
- Removidos decorators do Swagger (ApiProperty)
- Mantida estrutura ORM completa com relacionamentos
--------------------------------------------
Explicação da lógica:
A entidade PaymentMethod representa as formas de pagamento disponíveis no sistema
e sincronizadas com o Bling ERP. Contém informações como tipo, status e juros padrão.
Remover o Swagger elimina o risco de dependência circular e melhora a modularidade.
by: gabbu (github: gabriellesote) ✧
*/
