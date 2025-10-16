// src/user/dto/create-user.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString} from 'class-validator';
import { IsCPF } from 'class-validator-cpf';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsCPF({ message: 'CPF inválido' })
  cpf: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsDateString()
  birthDate: Date;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(['admin', 'common'])
  userType?: 'admin' | 'common';
}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Criação do DTO CreateUserDto para validação na criação de usuários
// --------------------------------------------------------------
// Explicação da lógica:
// DTO utilizado para validar os dados recebidos ao criar um usuário, incluindo 
// campos obrigatórios e opcionais, e garantindo consistência dos tipos.
// by: gabbu (github: gabriellesote)
