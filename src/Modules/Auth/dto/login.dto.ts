// src/Modules/Auth/dto/login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'E-mail do usuário' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  @MinLength(6, { message: 'A senha deve conter pelo menos 6 caracteres.' })
  password: string;
}

/*
Histórico de alterações:
Edição: 25/10/2025 - 02:10
- Criação do LoginDto para validação do payload de autenticação
--------------------------------------------
Explicação da lógica:
DTO simples para validar as credenciais de login (e-mail e senha).
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
