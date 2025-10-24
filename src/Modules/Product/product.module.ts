// src/Modules/Product/product.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { Category } from '../Category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}

/*
Histórico de alterações:
Edição: 26/10/2025 - 01:25
- Removido CloudinaryModule
- Padronizado repositório e exportação do ProductService
--------------------------------------------
Explicação da lógica:
O ProductModule centraliza a lógica de produtos, integrando Product e Category.
Cloudinary foi removido, e o módulo agora fornece o serviço de produtos
para uso em outros módulos, como pedidos e carrinho.
by: gabbu (github: gabriellesote) ✧
*/
