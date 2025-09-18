import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export type TipoUsuario = 'admin' | 'comum';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  cpf: string;

  @Column()
  cep: string;

  @Column()
  dataNascimento: Date;

  @Column({ unique: true })
  login: string;

  @Column()
  senha: string;

  @Column({ type: 'enum', enum: ['admin', 'comum'], default: 'comum' })
  tipoUsuario: TipoUsuario;
}