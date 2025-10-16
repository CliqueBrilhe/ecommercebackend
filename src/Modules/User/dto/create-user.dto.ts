// src/user/dto/create-user.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { IsCPF } from 'class-validator-cpf';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiProperty({ description: 'CEP do usuário' })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({ description: 'Data de nascimento do usuário', type: String, format: 'date' })
  @IsDateString()
  birthDate: Date;

  @ApiProperty({ description: 'Nome de usuário único' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiPropertyOptional({ description: 'Tipo do usuário (admin ou common)' })
  @IsOptional()
  @IsEnum(['admin', 'common'])
  userType?: 'admin' | 'common';
}

/*
Histórico de alterações:
Edição: 15/10/2025 - Criação do DTO CreateUserDto para validação na criação de usuários
Edição: 16/10/2025 - Adicionados decorators do Swagger (@ApiProperty, @ApiPropertyOptional)
--------------------------------------------
Explicação da lógica:
DTO utilizado para validar os dados recebidos ao criar um usuário, incluindo campos obrigatórios
e opcionais, garantindo consistência dos tipos, agora documentado no Swagger.
by: gabbu (github: gabriellesote)
*/
