// src/Modules/Address/entities/address.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../User/entities/user.entity';

@Entity({ name: 'address' })
export class Address {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID do endereço' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Logradouro ou rua do endereço' })
  street: string;

  @Column()
  @ApiProperty({ description: 'Número do imóvel' })
  number: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Complemento do endereço (ex: Apto 202, Bloco B)' })
  complement?: string;

  @Column()
  @ApiProperty({ description: 'Bairro do endereço' })
  neighborhood: string;

  @Column()
  @ApiProperty({ description: 'Cidade do endereço' })
  city: string;

  @Column({ length: 2 })
  @ApiProperty({ description: 'Estado (UF) do endereço, ex: MG, SP, RJ' })
  state: string;

  @Column()
  @ApiProperty({ description: 'CEP do endereço' })
  zipCode: string;

  @Column({ default: false })
  @ApiProperty({ description: 'Define se este é o endereço fiscal principal do usuário' })
  isMain: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Identificador do endereço no Bling ERP (blingId)' })
  blingId?: number;

  @Column({ default: false })
  @ApiProperty({ description: 'Indica se o endereço está sincronizado com o Bling' })
  synchronized: boolean;

  @ManyToOne(() => User, (user) => user.addresses, { onDelete: 'CASCADE' })
  @ApiProperty({ description: 'Usuário associado a este endereço' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'Data de criação do endereço' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'Data da última atualização do endereço' })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 22/10/2025 - 23:45
- Criação da entidade Address compatível com Bling e NFC-e.
- Adicionados campos fiscais (rua, número, bairro, cidade, estado, cep).
- Relacionamento ManyToOne com User e flag isMain para endereço fiscal principal.
--------------------------------------------
Explicação da lógica:
Esta entidade representa os endereços de um usuário.
Cada endereço pertence a um único usuário (ManyToOne),
mas um usuário pode ter vários endereços (OneToMany).
Inclui um campo 'isMain' para marcar o endereço fiscal principal
usado na emissão de notas (NFC-e) e campos de controle de
sincronização com o Bling ERP.
by: gabbu (github: gabriellesote) ✧
*/
