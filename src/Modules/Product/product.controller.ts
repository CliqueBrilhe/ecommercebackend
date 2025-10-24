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
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

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
    type: ProductResponseDto, // ✅ DTO documental (não a entity)
  })
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    return this.mapToResponse(product);
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
    type: [ProductResponseDto],
  })
  async findAll() {
    const products = await this.productService.findAll();
    return products.map((p) => this.mapToResponse(p));
  }

  // 🧩 Busca por ID
  @Get(':id')
  @ApiOperation({ summary: 'Busca produto por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado',
    type: ProductResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.findOne(id);
    return this.mapToResponse(product);
  }

  // 🧩 Atualização de produto
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um produto por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso',
    type: ProductResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() product: UpdateProductDto,
  ) {
    const updated = await this.productService.update(id, product);
    return this.mapToResponse(updated);
  }

  // 🧩 Exclusão de produto
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um produto por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.productService.delete(id);
  }

  // 🪄 Método auxiliar interno — converte entidade em DTO documental
  private mapToResponse(product: any): ProductResponseDto {
    return {
      id: product.id,
      blingId: product.blingId,
      code: product.code,
      name: product.name,
      stockQuantity: product.stockQuantity,
      price: Number(product.price),
      stock: product.stock,
      promotion: product.promotion,
      width: product.width,
      height: product.height,
      depth: product.depth,
      images: product.images || [],
      description: product.description,
      categoryId: product.category?.id ?? null,
      synchronized: product.synchronized,
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 01:35
- Substituídos tipos Swagger de Product → ProductResponseDto
- Adicionado mapeador interno mapToResponse() para conversão segura
--------------------------------------------
Explicação da lógica:
Este controller mantém toda a lógica original de CRUD intacta,
mas documenta as respostas via ProductResponseDto para evitar
dependências circulares e exibir respostas mais limpas no Swagger.
by: gabbu (github: gabriellesote) ✧
*/
