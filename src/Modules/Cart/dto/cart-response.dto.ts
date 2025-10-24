// src/Modules/Cart/dto/cart-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CartItemResponseDto {
  @ApiProperty({ example: 1, description: 'ID do item do carrinho' })
  id: number;

  @ApiProperty({ example: 10, description: 'ID do produto' })
  productId: number;

  @ApiProperty({ example: 'Base Líquida Matte', description: 'Nome do produto' })
  productName: string;

  @ApiProperty({ example: 2, description: 'Quantidade do produto' })
  quantity: number;

  @ApiProperty({ example: 79.9, description: 'Preço unitário do produto' })
  price: number;

  @ApiProperty({ example: 159.8, description: 'Subtotal (quantidade × preço)' })
  subtotal: number;
}

export class CartResponseDto {
  @ApiProperty({ example: 1, description: 'ID do carrinho' })
  id: number;

  @ApiProperty({ example: 5, description: 'ID do usuário dono do carrinho' })
  userId: number;

  @ApiProperty({
    example: 'active',
    enum: ['active', 'converted', 'abandoned'],
    description: 'Status do carrinho',
  })
  status: 'active' | 'converted' | 'abandoned';

  @ApiProperty({ example: 299.9, description: 'Valor total do carrinho' })
  total: number;

  @ApiProperty({
    type: [CartItemResponseDto],
    description: 'Itens contidos no carrinho',
  })
  items: CartItemResponseDto[];

  @ApiProperty({
    example: '2025-10-26T03:30:00.000Z',
    description: 'Data de criação do carrinho',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-10-26T03:35:00.000Z',
    description: 'Data da última atualização do carrinho',
  })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 03:30
- Criados CartResponseDto e CartItemResponseDto para respostas seguras no Swagger
--------------------------------------------
Explicação da lógica:
Esses DTOs documentam as respostas retornadas pelos endpoints de carrinhos.
Eles contêm apenas informações essenciais, evitando loops e Promises do TypeORM.
by: gabbu (github: gabriellesote) ✧
*/
