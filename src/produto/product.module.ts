// src/product/product.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { Category } from 'src/categoria/categoria.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), CloudinaryModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração de nomenclaturas para inglês (module, controller, entity, service e imports)
// --------------------------------------------------------------
// Explicação da lógica:
// Este módulo registra o controller e service de produtos, além de importar as entities
// Product e Category para integração com o TypeORM e o CloudinaryModule para upload de imagens.
// by: gabbu (github: gabriellesote)
