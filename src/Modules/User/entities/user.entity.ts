// src/user/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type UserType = 'admin' | 'common';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  zipCode: string;

  @Column()
  birthDate: Date;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'simple-enum', enum: ['admin', 'common'], default: 'common' })
  userType: UserType;
}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração da entidade Usuário para User com campos em inglês
// --------------------------------------------------------------
// Explicação da lógica:
// A entidade representa os usuários do sistema. Foram renomeados os campos 
// para inglês mantendo a tabela em português ('usuario') para compatibilidade 
// com o banco atual. Inclui campos de identificação, autenticação e tipo de usuário.
// by: gabbu (github: gabriellesote)
