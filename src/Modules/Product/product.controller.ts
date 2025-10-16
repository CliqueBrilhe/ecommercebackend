// src/product/product.controller.ts
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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../../Core/cloudinary/cloudinary.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.cloudinaryService.uploadImage(file);
    return { imageUrl };
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    // Se veio arquivo, envia pro Cloudinary e pega URL
    if (file) {
      const imageUrl = await this.cloudinaryService.uploadImage(file);
      createProductDto.images = [imageUrl]; // salva como array
    }

    return this.productService.create(createProductDto);
  }

  @Get('categories')
  async getCategories() {
    return this.productService.getCategories();
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() product: Partial<Product>) {
    return this.productService.update(id, product);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productService.delete(id);
  }
}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração de nomenclaturas para inglês (controller, rotas, métodos, variáveis e DTOs)
// --------------------------------------------------------------
// Explicação da lógica:
// Este controller expõe endpoints para gerenciamento de produtos, incluindo upload de imagens,
// criação, listagem, busca por ID, atualização e remoção de produtos.
// A integração com o Cloudinary permite armazenar imagens externas e atualizar o DTO de imagens.
// by: gabbu (github: gabriellesote)
