// src/Modules/Cart/cart.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Cart } from './entities/cart.entity';
import { CartResponseDto } from './dto/cart-response.dto';

@ApiTags('Carts')
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo carrinho' })
  @ApiBody({ type: CreateCartDto })
  @ApiResponse({
    status: 201,
    description: 'Carrinho criado com sucesso',
    type: CartResponseDto,
  })
  async create(@Body() createCartDto: CreateCartDto): Promise<CartResponseDto> {
    const cart = await this.cartService.create(createCartDto);
    return this.mapToResponse(cart);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os carrinhos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de carrinhos',
    type: [CartResponseDto],
  })
  async findAll(): Promise<CartResponseDto[]> {
    const carts = await this.cartService.findAll();
    return carts.map((c) => this.mapToResponse(c));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um carrinho por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Carrinho encontrado',
    type: CartResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CartResponseDto> {
    const cart = await this.cartService.findOne(id);
    return this.mapToResponse(cart);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um carrinho por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCartDto })
  @ApiResponse({
    status: 200,
    description: 'Carrinho atualizado com sucesso',
    type: CartResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<CartResponseDto> {
    const updated = await this.cartService.update(id, updateCartDto);
    return this.mapToResponse(updated);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um carrinho por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Carrinho removido com sucesso' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.cartService.delete(id);
  }

  // 🔄 Converte entity → DTO documental
  private mapToResponse(cart: Cart): CartResponseDto {
    return {
      id: cart.id,
      userId: (cart as any).user?.id ?? null,
      status: cart.status,
      total: cart.total,
      items:
        cart.items?.map((item) => ({
          id: item.id,
          productId: (item as any).product?.id ?? null,
          productName: (item as any).product?.name ?? '',
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        })) ?? [],
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 03:30
- Substituído tipo Cart por CartResponseDto no Swagger
- Adicionado mapToResponse() para converter Entity → DTO
--------------------------------------------
Explicação da lógica:
O CartController mantém toda a lógica original de CRUD, mas retorna respostas documentadas
com o CartResponseDto. Evita dependências circulares e melhora o desempenho do Swagger.
by: gabbu (github: gabriellesote) ✧
*/
