// src/Modules/Cart/dto/create-cart.dto.ts
import {
  IsInt,
  IsArray,
  ValidateNested,
  Min,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CartItemDto {
  @ApiProperty({ description: 'ID do produto adicionado ao carrinho' })
  @IsInt()
  productId: number;

  @ApiProperty({ description: 'Quantidade do produto', example: 2 })
  @IsInt()
  @Min(1, { message: 'A quantidade mínima é 1' })
  quantity: number;
}

export class CreateCartDto {
  @ApiProperty({ description: 'ID do usuário dono do carrinho' })
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'Itens do carrinho', type: [CartItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 02:05
- Criação do DTO de criação de carrinho com suporte a múltiplos itens.
--------------------------------------------
Explicação da lógica:
DTO utilizado para criação de carrinhos, validando estrutura e tipos
de dados antes da criação no banco. Inclui subclasse para itens.
by: gabbu (github: gabriellesote)
*/
