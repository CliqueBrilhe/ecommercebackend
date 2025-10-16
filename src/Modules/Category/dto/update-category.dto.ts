// src/category/dto/update-category.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

// PartialType faz com que todos os campos de CreateCategoryDto se tornem opcionais.
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração de nomenclaturas para inglês (DTO e importações)
// --------------------------------------------------------------
// Explicação da lógica:
// DTO utilizado para validação na atualização de categorias, tornando todos os
// campos opcionais para permitir alterações parciais.
// by: gabbu (github: gabriellesote)
