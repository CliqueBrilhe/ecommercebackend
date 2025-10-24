// src/Modules/User/dto/update-user.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString, IsPhoneNumber, IsEmail } from 'class-validator';
import type { UserType, UserStatus } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'Novo e-mail do usuário (opcional)',
    example: 'novoemail@exemplo.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'E-mail inválido' })
  email?: string;

  @ApiPropertyOptional({
    description: 'Novo número de telefone do usuário (opcional)',
    example: '+55 31 98888-9999',
  })
  @IsOptional()
  @IsPhoneNumber('BR', { message: 'Número de telefone inválido' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Atualização de tipo de usuário (admin ou common)',
    enum: ['admin', 'common'],
  })
  @IsOptional()
  @IsEnum(['admin', 'common'])
  userType?: UserType;

  @ApiPropertyOptional({
    description: 'Atualização de status do usuário (active, inactive, deleted, no_activity)',
    enum: ['active', 'inactive', 'deleted', 'no_activity'],
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'deleted', 'no_activity'])
  status?: UserStatus;

  @ApiPropertyOptional({
    description: 'Atualização do ID do cliente correspondente no Bling ERP',
    example: 78945,
  })
  @IsOptional()
  blingId?: number;
}

/*
Histórico de alterações:
Edição: 25/10/2025 - 01:45
- Atualizado para permitir atualização parcial do usuário com base no CreateUserDto
- Adicionados campos opcionais: email, phone, userType, status e blingId
- Validações e documentação Swagger completas
--------------------------------------------
Explicação da lógica:
O DTO de atualização permite alterar parcialmente os dados de um usuário.
Mantém o formato base do CreateUserDto com campos opcionais e novos atributos
ligados ao controle de status e integração com o Bling ERP.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
