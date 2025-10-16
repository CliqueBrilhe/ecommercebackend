// src/category/dto/create-category.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Nome da categoria' })
  @IsString({ message: 'O nome deve ser uma string.' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  name: string;

  @ApiPropertyOptional({ description: 'Ordem da categoria (opcional)' })
  @IsOptional()
  @IsInt({ message: 'A ordem deve ser um número inteiro.' })
  order?: number;

  @ApiPropertyOptional({ description: 'ID da categoria pai (opcional)' })
  @IsOptional()
  @IsInt({ message: 'O ID do pai deve ser um número inteiro.' })
  parentId?: number;
}

/*
Histórico de alterações:
Edição: 15/10/2025 - Refatoração de nomenclaturas para inglês (DTO, campos e validações)
Edição: 16/10/2025 - Adicionados decorators do Swagger (@ApiProperty, @ApiPropertyOptional)
--------------------------------------------
Explicação da lógica:
DTO utilizado para validação na criação de categorias, garantindo que os campos obrigatórios
e opcionais estejam corretos antes de enviar para o service. Agora documentado no Swagger.
by: gabbu (github: gabriellesote)
*/
