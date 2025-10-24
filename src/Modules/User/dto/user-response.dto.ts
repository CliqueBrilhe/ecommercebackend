import { ApiProperty } from '@nestjs/swagger';
import type { UserStatus, UserType } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Gabrielle Soares' })
  name: string;

  @ApiProperty({
    example: '2025-10-23T22:15:00.000Z',
    required: false,
    description: 'Data e hora do último login',
  })
  lastLoginAt?: Date;

  @ApiProperty({ example: '123.456.789-00' })
  cpf: string;

  @ApiProperty({ example: 'gabrielle@exemplo.com' })
  email: string;

  @ApiProperty({ example: '+55 31 98888-0000' })
  phone: string;

  @ApiProperty({ example: 'common', enum: ['admin', 'common'] })
  userType: UserType;

  @ApiProperty({
    example: 'active',
    enum: ['active', 'inactive', 'deleted', 'no_activity'],
  })
  status: UserStatus;

  @ApiProperty({
    example: 32145,
    description: 'ID correspondente no Bling ERP',
    required: false,
  })
  blingId?: number;

  @ApiProperty({ example: false })
  synchronized: boolean;

  @ApiProperty({
    example: '2025-10-25T01:00:00.000Z',
    description: 'Data de criação do registro',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-10-25T01:30:00.000Z',
    description: 'Data da última atualização',
  })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 25/10/2025 - 00:35
- Criado DTO de resposta seguro para Swagger
- Incluídos apenas campos primitivos e controlados
--------------------------------------------
Explicação da lógica:
O UserResponseDto é usado para documentar respostas da API sem expor
relacionamentos ou loops com outras entidades. Ele é seguro para o Swagger
e segue o padrão de documentação clara e minimalista.
by: gabbu (github: gabriellesote) ✧
*/
