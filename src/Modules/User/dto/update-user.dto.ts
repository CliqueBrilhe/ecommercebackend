// src/user/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Criação do DTO UpdateUserDto como PartialType de CreateUserDto
// --------------------------------------------------------------
// Explicação da lógica:
// Todos os campos de CreateUserDto se tornam opcionais para atualização de usuários.
// by: gabbu (github: gabriellesote)
