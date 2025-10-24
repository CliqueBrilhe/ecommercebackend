// src/Modules/Wishlist/dto/create-wishlist-item.dto.ts
import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWishlistItemDto {
  @ApiProperty({ description: 'ID do usuário dono da lista de desejos' })
  @IsInt({ message: 'O ID do usuário deve ser um número inteiro.' })
  userId: number;

  @ApiProperty({ description: 'ID do produto a ser adicionado à lista' })
  @IsInt({ message: 'O ID do produto deve ser um número inteiro.' })
  productId: number;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 03:45
- Criado DTO para criação de itens da lista de desejos.
--------------------------------------------
Explicação da lógica:
DTO que define a estrutura dos dados para adicionar um produto à lista
de desejos de um usuário, garantindo tipos válidos.
by: gabbu (github: gabriellesote)
*/
