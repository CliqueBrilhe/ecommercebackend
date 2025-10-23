// src/Modules/User/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Address } from '../../Address/entities/address.entity';

export type UserType = 'admin' | 'common';
export type UserStatus = 'active' | 'inactive' | 'deleted' | 'no_activity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID do usuário' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Nome completo do usuário' })
  name: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'CPF único do usuário' })
  cpf: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'E-mail do usuário (usado para login e notas fiscais)' })
  email: string;

  @Column()
  @ApiProperty({ description: 'Telefone do usuário' })
  phone: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Data de nascimento do usuário (opcional)' })
  birthDate: Date;

  @Column()
  @ApiProperty({ description: 'Senha criptografada do usuário' })
  password: string;

  @Column({ type: 'simple-enum', enum: ['admin', 'common'], default: 'common' })
  @ApiProperty({
    description: 'Tipo de usuário no sistema',
    enum: ['admin', 'common'],
    default: 'common',
  })
  userType: UserType;

  @Column({ type: 'simple-enum', enum: ['active', 'inactive', 'deleted', 'no_activity'], default: 'active' })
  @ApiProperty({
    description: 'Status atual do usuário',
    enum: ['active', 'inactive', 'deleted', 'no_activity'],
    default: 'active',
  })
  status: UserStatus;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Identificador do usuário no Bling ERP (blingId)' })
  blingId?: number;

  @Column({ default: false })
  @ApiProperty({ description: 'Indica se o usuário está sincronizado com o Bling' })
  synchronized: boolean;

  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  @ApiProperty({ description: 'Lista de endereços associados ao usuário' })
  addresses: Address[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'Data de criação do usuário' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ description: 'Data da última atualização do usuário' })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 23/10/2025 - 00:12
- Traduzido campo 'sincronizado' para 'synchronized'
- Adicionado campo 'status' (active, inactive, deleted, no_activity)
- Definida política de soft delete (exclusão lógica)
--------------------------------------------
Explicação da lógica:
A entidade User representa os clientes e administradores do sistema.
Cada usuário pode ter múltiplos endereços. O campo 'status' controla a
situação do usuário no sistema sem removê-lo do banco (soft delete),
mantendo histórico fiscal e integridade de pedidos e notas fiscais.
O campo 'synchronized' indica se o cliente já foi sincronizado com o Bling ERP.
by: gabbu (github: gabriellesote) ✧
*/
