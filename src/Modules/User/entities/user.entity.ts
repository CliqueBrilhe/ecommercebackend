// src/Modules/User/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export type UserType = 'admin' | 'common';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID do usuário' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Nome do usuário' })
  name: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'CPF único do usuário' })
  cpf: string;

  @Column()
  @ApiProperty({ description: 'CEP do usuário' })
  zipCode: string;

  @Column()
  @ApiProperty({ description: 'Data de nascimento do usuário' })
  birthDate: Date;

  @Column({ unique: true })
  @ApiProperty({ description: 'Nome de usuário para login' })
  username: string;

  @Column()
  @ApiProperty({ description: 'Senha do usuário' })
  password: string;

  @Column({ type: 'simple-enum', enum: ['admin', 'common'], default: 'common' })
  @ApiProperty({ description: 'Tipo de usuário', enum: ['admin', 'common'], default: 'common' })
  userType: UserType;
}

/*
Histórico de alterações:
Edição: 15/10/2025
- Refatoração da entidade Usuário para User com campos em inglês
Edição: 16/10/2025
- Adicionados decorators do Swagger (@ApiProperty) para documentação de todos os campos
--------------------------------------------
Explicação da lógica:
A entidade representa os usuários do sistema. Foram renomeados os campos 
para inglês mantendo a tabela em português ('usuario') para compatibilidade 
com o banco atual. Inclui campos de identificação, autenticação e tipo de usuário.
by: gabbu (github: gabriellesote)
*/
