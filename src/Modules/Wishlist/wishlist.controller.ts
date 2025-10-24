// src/Modules/Wishlist/wishlist.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';
import { WishlistItem } from './entities/wishlist-item.entity';
import { WishlistResponseDto } from './dto/wishlist-response.dto';

@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @ApiOperation({ summary: 'Adiciona um produto à lista de desejos do usuário' })
  @ApiBody({ type: CreateWishlistItemDto })
  @ApiResponse({
    status: 201,
    description: 'Item adicionado com sucesso',
    type: WishlistResponseDto,
  })
  async create(
    @Body() dto: CreateWishlistItemDto,
  ): Promise<WishlistResponseDto> {
    const item = await this.wishlistService.create(dto);
    return this.mapToResponse(item);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os itens de todas as listas de desejos' })
  @ApiResponse({
    status: 200,
    description: 'Itens listados com sucesso',
    type: [WishlistResponseDto],
  })
  async findAll(): Promise<WishlistResponseDto[]> {
    const items = await this.wishlistService.findAll();
    return items.map((i) => this.mapToResponse(i));
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lista a lista de desejos de um usuário específico' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Itens da lista do usuário',
    type: [WishlistResponseDto],
  })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<WishlistResponseDto[]> {
    const items = await this.wishlistService.findByUser(userId);
    return items.map((i) => this.mapToResponse(i));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um item da lista de desejos pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.wishlistService.delete(id);
  }

  @Delete('user/:userId/product/:productId')
  @ApiOperation({ summary: 'Remove um item específico (por usuário e produto)' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'productId', type: Number })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  async removeByUserAndProduct(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.removeByUserAndProduct(userId, productId);
  }

  // 🔄 Conversão segura: Entity → DTO documental
  private mapToResponse(item: WishlistItem): WishlistResponseDto {
    return {
      id: item.id,
      userId: (item as any).user?.id ?? null,
      userName: (item as any).user?.name ?? '',
      productId: (item as any).product?.id ?? null,
      productName: (item as any).product?.name ?? '',
      createdAt: item.createdAt,
    };
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 04:30
- Substituído tipo WishlistItem por WishlistResponseDto no Swagger
- Adicionado mapToResponse() para conversão segura entity → DTO
--------------------------------------------
Explicação da lógica:
O WishlistController mantém os endpoints originais de CRUD, mas agora retorna
respostas documentadas com WishlistResponseDto, evitando dependências circulares
e mantendo o Swagger limpo e descritivo.
by: gabbu (github: gabriellesote) ✧
*/
