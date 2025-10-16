// src/product/dto/create-product.dto.ts
import { IsNumber, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsNumber()
  stockQuantity: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  promotion?: number;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  depth: number;

  @IsArray()
  images: string[];

  @IsString()
  description: string;

  @IsNumber()
  categoryId: number;
}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração de nomenclaturas para inglês (DTO, campos e tipos)
// --------------------------------------------------------------
// Explicação da lógica:
// Este DTO define os campos necessários para criar um produto, incluindo código, nome, preço,
// estoque, dimensões, imagens, descrição e referência à categoria.
// Validações são aplicadas usando class-validator para garantir tipos e presença opcional de campos.
// by: gabbu (github: gabriellesote)
