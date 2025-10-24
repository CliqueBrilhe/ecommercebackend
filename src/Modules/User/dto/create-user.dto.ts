// src/Modules/User/dto/create-user.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsEmail,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';
import { IsCPF } from 'class-validator-cpf';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { UserType,UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome completo do usuário' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'CPF do usuário' })
  @IsString()
  @IsNotEmpty()
  @IsCPF({ message: 'CPF inválido' })
  cpf: string;

  @ApiProperty({ description: 'E-mail do usuário' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({ description: 'Telefone de contato do usuário', example: '+55 31 99999-9999' })
  @IsPhoneNumber('BR', { message: 'Número de telefone inválido.' })
  phone: string;

  @ApiProperty({ description: 'Senha do usuário (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6, { message: 'A senha deve conter pelo menos 6 caracteres.' })
  password: string;

  @ApiPropertyOptional({
    description: 'Tipo de usuário (admin ou common)',
    enum: ['admin', 'common'],
    default: 'common',
  })
  @IsOptional()
  @IsEnum(['admin', 'common'])
  userType?: UserType;

  @ApiPropertyOptional({
    description: 'Status inicial do usuário',
    enum: ['active', 'inactive', 'deleted', 'no_activity'],
    default: 'active',
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'deleted', 'no_activity'])
  status?: UserStatus;

  @ApiPropertyOptional({
    description: 'ID correspondente ao cliente no Bling ERP (opcional)',
    example: 12345,
  })
  @IsOptional()
  blingId?: number;
}

/*
Histórico de alterações:
Edição: 25/10/2025 - 01:10
- Reestruturado para refletir novos campos da entidade User
- Adicionados campos: email, phone, status, blingId, synchronized
- Removidos campos obsoletos (zipCode, username, birthDate)
- Tipagem e validações alinhadas ao modelo UserType/UserStatus e integração com Bling ERP
--------------------------------------------
Explicação da lógica:
DTO responsável por validar e documentar os dados de criação de usuários.
Agora suporta campos de contato, autenticação e controle de sincronização
com o Bling ERP. As validações garantem CPF e telefone válidos e senha mínima.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
