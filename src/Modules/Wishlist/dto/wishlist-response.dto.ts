// src/Modules/Wishlist/dto/wishlist-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class WishlistResponseDto {
  @ApiProperty({ example: 1, description: 'ID do item da lista de desejos' })
  id: number;

  @ApiProperty({ example: 5, description: 'ID do usuário dono da lista' })
  userId: number;

  @ApiProperty({ example: 'Gabrielle Soares', description: 'Nome do usuário dono da lista' })
  userName: string;

  @ApiProperty({ example: 42, description: 'ID do produto adicionado' })
  productId: number;

  @ApiProperty({ example: 'Batom Líquido Matte', description: 'Nome do produto adicionado' })
  productName: string;

  @ApiProperty({
    example: '2025-10-26T04:30:00.000Z',
    description: 'Data em que o produto foi adicionado à lista',
  })
  createdAt: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 04:30
- Criado WishlistResponseDto para respostas seguras no Swagger
--------------------------------------------
Explicação da lógica:
DTO documental usado para retornar informações seguras e completas sobre
os itens da lista de desejos, evitando dependências circulares e dados sensíveis.
by: gabbu (github: gabriellesote) ✧
*/
