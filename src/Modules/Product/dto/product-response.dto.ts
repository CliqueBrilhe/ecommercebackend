// src/Modules/Product/dto/product-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: 1, description: 'ID interno do produto' })
  id: number;

  @ApiProperty({ example: 998877, description: 'ID do produto no Bling ERP' })
  blingId: number | null;

  @ApiProperty({ example: 'BASE123', description: 'Código único do produto' })
  code: string;

  @ApiProperty({ example: 'Base Líquida Matte 30ml', description: 'Nome do produto' })
  name: string;

  @ApiProperty({ example: 120, description: 'Quantidade total em estoque' })
  stockQuantity: number;

  @ApiProperty({ example: 89.9, description: 'Preço atual do produto' })
  price: number;

  @ApiProperty({ example: 5, description: 'Estoque real disponível' })
  stock: number;

  @ApiProperty({ example: 10, description: 'Percentual de promoção (%)' })
  promotion: number;

  @ApiProperty({ example: 5.5, description: 'Largura do produto (cm)' })
  width?: number;

  @ApiProperty({ example: 10.2, description: 'Altura do produto (cm)' })
  height?: number;

  @ApiProperty({ example: 2.3, description: 'Profundidade do produto (cm)' })
  depth?: number;

  @ApiProperty({
    example: ['https://cdn.cliqueebrilhe.com/img/base-1.jpg'],
    description: 'URLs das imagens do produto',
  })
  images: string[];

  @ApiProperty({
    example: 'Base líquida de alta cobertura e longa duração.',
    description: 'Descrição detalhada do produto',
  })
  description?: string;

  @ApiProperty({
    example: 3,
    description: 'ID da categoria associada',
  })
  categoryId?: number;

  @ApiProperty({
    example: true,
    description: 'Indica se o produto já foi sincronizado com o Bling ERP',
  })
  synchronized: boolean;

  @ApiProperty({
    example: 'active',
    enum: ['active', 'to_verify', 'inactive'],
    description: 'Status do produto no sistema',
  })
  status: 'active' | 'to_verify' | 'inactive';

  @ApiProperty({
    example: '2025-10-26T01:00:00.000Z',
    description: 'Data de criação do produto',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-10-26T01:30:00.000Z',
    description: 'Data da última atualização do produto',
  })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 01:15
- Criado ProductResponseDto para uso exclusivo no Swagger
- Incluídos apenas campos primitivos e seguros
--------------------------------------------
Explicação da lógica:
O ProductResponseDto serve para documentar a resposta dos endpoints de produtos
sem expor relacionamentos complexos. Ele evita dependências circulares e garante
documentação clara e segura para o Swagger.
by: gabbu (github: gabriellesote) ✧
*/
