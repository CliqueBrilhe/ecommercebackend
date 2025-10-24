// src/Modules/Address/entities/address.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../User/entities/user.entity';

@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  complement?: string;

  @Column()
  neighborhood: string;

  @Column()
  city: string;

  @Column({ length: 2 })
  state: string;

  @Column()
  zipCode: string;

  @Column({ default: false })
  isMain: boolean;

  @Column({ nullable: true })
  blingId?: number;

  @Column({ default: false })
  synchronized: boolean;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 04:45
- Removidos decorators do Swagger e mantida estrutura original
--------------------------------------------
Explicação da lógica:
A entidade Address representa os endereços de um usuário e permite múltiplos registros
por usuário, com marcação de endereço fiscal principal e sincronização com o Bling ERP.
by: gabbu (github: gabriellesote) ✧
*/
