// src/Modules/Product/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../../Core/cloudinary/cloudinary.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiOperation({ summary: 'Faz upload de uma imagem para o Cloudinary' })
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({ description: 'Arquivo de imagem', type: 'string' })

  // @ApiResponse({ status: 201, description: 'URL da imagem enviada com sucesso' })
  // async uploadImage(@UploadedFile() file: Express.Multer.File) {
  //   const imageUrl = await this.cloudinaryService.uploadImage(file);
  //   return { imageUrl };
  // }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Cria um novo produto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateProductDto, description: 'Dados do produto e imagem opcional' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso', type: Product })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    if (file) {
      const imageUrl = await this.cloudinaryService.uploadImage(file);
      createProductDto.images = [imageUrl];
    }
    return this.productService.create(createProductDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Lista categorias disponíveis para produtos' })
  @ApiResponse({ status: 200, description: 'Lista de categorias', type: [Object] })
  async getCategories() {
    return this.productService.getCategories();
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos', type: [Product] })
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca produto por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Produto encontrado', type: Product })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um produto por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: Product, description: 'Dados do produto para atualização' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso', type: Product })
  update(@Param('id', ParseIntPipe) id: number, @Body() product: Partial<Product>) {
    return this.productService.update(id, product);
  }

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
Edição: 15/10/2025
- Refatoração de nomenclaturas para inglês (controller, rotas, métodos, variáveis e DTOs)
Edição: 16/10/2025
- Adicionados decorators do Swagger (@ApiTags, @ApiOperation, @ApiResponse, @ApiParam, @ApiBody, @ApiConsumes) para documentação de todos os endpoints
--------------------------------------------
Explicação da lógica:
Este controller expõe endpoints para gerenciamento de produtos, incluindo upload de imagens,
criação, listagem, busca por ID, atualização e remoção de produtos.
A integração com o Cloudinary permite armazenar imagens externas e atualizar o DTO de imagens.
by: gabbu (github: gabriellesote)
*/
