// src/Modules/Product/product.controller.ts
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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // 🧩 Criação de produto
  @Post()
  @ApiOperation({ summary: 'Cria um novo produto' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso',
    type: Product,
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  // 🧩 Listagem de categorias
  @Get('categories')
  @ApiOperation({ summary: 'Lista categorias disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias registradas',
    type: [String],
  })
  async getCategories() {
    return this.productService.getCategories();
  }

  // 🧩 Listagem geral
  @Get()
  @ApiOperation({ summary: 'Lista todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos',
    type: [Product],
  })
  findAll() {
    return this.productService.findAll();
  }

  // 🧩 Busca por ID
  @Get(':id')
  @ApiOperation({ summary: 'Busca produto por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado',
    type: Product,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  // 🧩 Atualização de produto
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um produto por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: Product })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso',
    type: Product,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() product: Partial<Product>,
  ) {
    return this.productService.update(id, product);
  }

  // 🧩 Exclusão de produto
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um produto por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.productService.delete(id);
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 01:25
- Removida lógica de upload (Cloudinary)
- Atualizado para trabalhar apenas com DTOs e ProductService
--------------------------------------------
Explicação da lógica:
O ProductController fornece endpoints CRUD para produtos.
Removida dependência de upload e padronizada documentação Swagger.
by: gabbu (github: gabriellesote) ✧
*/
