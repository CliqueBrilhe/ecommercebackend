// src/Bling/catalogo/produtos/produto.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';
import { ProdutoSyncService } from './produto-sync.service';
import { Product } from '../../../Modules/Product/entities/product.entity';
import { Category } from '../../../Modules/Category/entities/category.entity';
import { ProdutoListener } from './produto.listener';
@Module({
  imports: [TypeOrmModule.forFeature([Product, Category])],
  providers: [ProdutoService, ProdutoSyncService, ProdutoListener],
  controllers: [ProdutoController],
})
export class ProdutoModule {}
/*
🗓 24/10/2025 - 17:15
🏗️ Estruturação do módulo Produto.
--------------------------------------------
📘 Lógica:
- Agrupa os services e controller relacionados a produtos do Bling.
- Expõe os serviços para uso no Core (ex: scheduler).
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
