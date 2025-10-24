// src/Modules/Category/dto/category-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ example: 1, description: 'ID da categoria' })
  id: number;

  @ApiProperty({ example: 12345, description: 'ID da categoria no Bling', required: false })
  blingId?: number;

  @ApiProperty({ example: 'Maquiagem', description: 'Nome da categoria' })
  name: string;

  @ApiProperty({
    example: 'beleza/maquiagem',
    description: 'Caminho (slug) completo da categoria',
    required: false,
  })
  path?: string;

  @ApiProperty({ example: 1, description: 'Ordem de exibição da categoria' })
  order: number;

  @ApiProperty({
    example: 2,
    description: 'ID da categoria pai (se existir)',
    required: false,
  })
  parentId?: number | null;

  @ApiProperty({
    example: [3, 4],
    description: 'IDs das subcategorias diretas',
    required: false,
  })
  childrenIds?: number[];

  @ApiProperty({
    example: ['Base Líquida Matte', 'Batom Vermelho 24h'],
    description: 'Nomes dos produtos vinculados a esta categoria',
    required: false,
  })
  productNames?: string[];

  @ApiProperty({
    example: '2025-10-26T01:50:00.000Z',
    description: 'Data de criação da categoria',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-10-26T02:00:00.000Z',
    description: 'Data da última atualização da categoria',
  })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 01:50
- Criado CategoryResponseDto para documentar categorias no Swagger
- Incluídos apenas campos primitivos e arrays de nomes/IDs
--------------------------------------------
Explicação da lógica:
O CategoryResponseDto descreve a resposta limpa dos endpoints de categorias,
sem dependências circulares. Ele inclui informações essenciais de hierarquia,
produtos associados e metadados de criação/atualização.
by: gabbu (github: gabriellesote) ✧
*/
