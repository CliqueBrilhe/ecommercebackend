// src/Modules/Wishlist/dto/update-wishlist-item.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateWishlistItemDto } from './create-wishlist-item.dto';

export class UpdateWishlistItemDto extends PartialType(CreateWishlistItemDto) {}

/*
Histórico de alterações:
Edição: 26/10/2025 - 03:45
- Criado DTO para atualização de itens da lista de desejos.
--------------------------------------------
Explicação da lógica:
Permite atualizações parciais, como troca de produto ou usuário
(via interface administrativa ou sincronização).
by: gabbu (github: gabriellesote)
*/
