// src/Modules/Product/dto/create-product.dto.ts
import {
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ description: 'Código único do produto' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Nome do produto' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Quantidade em estoque disponível' })
  @IsInt({ message: 'A quantidade deve ser um número inteiro' })
  @Min(0, { message: 'A quantidade não pode ser negativa' })
  stock: number;

  @ApiProperty({ description: 'Preço do produto' })
  @IsNumber({}, { message: 'O preço deve ser um número' })
  price: number;

  @ApiPropertyOptional({
    description: 'Percentual de promoção aplicado (0–100)',
    example: 10,
  })
  @IsOptional()
  @IsInt({ message: 'O valor da promoção deve ser um número inteiro' })
  promotion?: number;

  @ApiPropertyOptional({ description: 'Largura do produto (cm)', example: 5.5 })
  @IsOptional()
  @IsNumber({}, { message: 'A largura deve ser um número' })
  width?: number;

  @ApiPropertyOptional({ description: 'Altura do produto (cm)', example: 10.2 })
  @IsOptional()
  @IsNumber({}, { message: 'A altura deve ser um número' })
  height?: number;

  @ApiPropertyOptional({ description: 'Profundidade do produto (cm)', example: 2.3 })
  @IsOptional()
  @IsNumber({}, { message: 'A profundidade deve ser um número' })
  depth?: number;

  @ApiPropertyOptional({
    description: 'URLs das imagens do produto',
    type: [String],
    example: ['https://cdn.cliqueebrilhe.com/produto123.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    description: 'Descrição detalhada do produto',
    example: 'Base líquida de alta cobertura e longa duração.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'ID da categoria associada' })
  @IsNumber({}, { message: 'O ID da categoria deve ser numérico' })
  categoryId: number;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 01:40
- Renomeado stockQuantity → stock para alinhar com entity
- Tornados width, height e depth opcionais
- Ajustado promotion como percentual (int)
- Adicionado IsString({ each: true }) em images
--------------------------------------------
Explicação da lógica:
DTO usado para criação de produtos, alinhado à entidade Product.
Remove campos internos e valida dimensões e estoque com segurança.
by: gabbu (github: gabriellesote) ✧
*/
