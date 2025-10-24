// src/Modules/Wishlist/wishlist.controller.ts
import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';
import { WishlistItem } from './entities/wishlist-item.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @ApiOperation({ summary: 'Adiciona um produto à lista de desejos do usuário' })
  @ApiBody({ type: CreateWishlistItemDto })
  @ApiResponse({ status: 201, description: 'Item adicionado com sucesso', type: WishlistItem })
  create(@Body() dto: CreateWishlistItemDto) {
    return this.wishlistService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os itens de todas as listas de desejos' })
  @ApiResponse({ status: 200, description: 'Itens listados com sucesso', type: [WishlistItem] })
  findAll() {
    return this.wishlistService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lista a lista de desejos de um usuário específico' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'Itens da lista do usuário', type: [WishlistItem] })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.wishlistService.findByUser(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um item da lista de desejos pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.wishlistService.delete(id);
  }

  @Delete('user/:userId/product/:productId')
  @ApiOperation({ summary: 'Remove um item específico (por usuário e produto)' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiParam({ name: 'productId', type: Number })
  @ApiResponse({ status: 200, description: 'Item removido com sucesso' })
  removeByUserAndProduct(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.wishlistService.removeByUserAndProduct(userId, productId);
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 04:00
- Criado controlador completo da lista de desejos.
--------------------------------------------
Explicação da lógica:
Gerencia endpoints REST para adição, listagem e exclusão de itens
da lista de desejos, com suporte a exclusão por ID ou por chave composta.
by: gabbu (github: gabriellesote)
*/
