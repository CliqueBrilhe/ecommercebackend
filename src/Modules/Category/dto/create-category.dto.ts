// src/category/dto/create-category.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  name: string;

  @IsOptional()
  @IsInt({ message: 'A ordem deve ser um número inteiro.' })
  order?: number;

  @IsOptional()
  @IsInt({ message: 'O ID do pai deve ser um número inteiro.' })
  parentId?: number;
}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração de nomenclaturas para inglês (DTO, campos e validações)
// --------------------------------------------------------------
// Explicação da lógica:
// DTO utilizado para validação na criação de categorias, garantindo que os campos
// obrigatórios e opcionais estejam corretos antes de enviar para o service.
// by: gabbu (github: gabriellesote)
