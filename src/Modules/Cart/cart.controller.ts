// src/Modules/Cart/cart.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './entities/cart.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo carrinho' })
  @ApiBody({ type: CreateCartDto })
  @ApiResponse({ status: 201, description: 'Carrinho criado com sucesso', type: Cart })
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os carrinhos' })
  @ApiResponse({ status: 200, description: 'Lista de carrinhos', type: [Cart] })
  findAll() {
    return this.cartService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um carrinho por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Carrinho encontrado', type: Cart })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um carrinho por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({ status: 200, description: 'Carrinho atualizado com sucesso', type: Cart })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(id, updateCartDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um carrinho por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Carrinho removido com sucesso' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.delete(id);
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 02:15
- Implementado controlador completo de carrinhos.
--------------------------------------------
Explicação da lógica:
Controlador REST para o módulo de carrinhos, utilizando DTOs de criação e atualização,
documentado com Swagger e conectado ao CartService.
by: gabbu (github: gabriellesote)
*/
