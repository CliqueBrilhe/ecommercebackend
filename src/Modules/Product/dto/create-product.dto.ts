// src/product/dto/create-product.dto.ts
import { IsNumber, IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Código único do produto' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Nome do produto' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Quantidade em estoque' })
  @IsNumber()
  stockQuantity: number;

  @ApiProperty({ description: 'Preço do produto' })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ description: 'Valor promocional (opcional)' })
  @IsOptional()
  @IsNumber()
  promotion?: number;

  @ApiProperty({ description: 'Largura do produto' })
  @IsNumber()
  width: number;

  @ApiProperty({ description: 'Altura do produto' })
  @IsNumber()
  height: number;

  @ApiProperty({ description: 'Profundidade do produto' })
  @IsNumber()
  depth: number;

  @ApiProperty({ description: 'URLs das imagens do produto', type: [String] })
  @IsArray()
  images: string[];

  @ApiProperty({ description: 'Descrição do produto' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'ID da categoria associada' })
  @IsNumber()
  categoryId: number;
}

/*
Histórico de alterações:
Edição: 15/10/2025 - Refatoração de nomenclaturas para inglês (DTO, campos e tipos)
Edição: 16/10/2025 - Adicionados decorators do Swagger (@ApiProperty, @ApiPropertyOptional)
--------------------------------------------
Explicação da lógica:
DTO define os campos necessários para criar um produto, incluindo código, nome, preço,
estoque, dimensões, imagens, descrição e referência à categoria.
Validações aplicadas usando class-validator e documentado no Swagger.
by: gabbu (github: gabriellesote)
*/
