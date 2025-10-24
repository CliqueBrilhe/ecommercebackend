// src/Bling/catalogo/categorias/categoria.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../../Modules/Category/entities/category.entity';
import { CategoriaService } from './categoria.service';
import { CategoriaSyncService } from './categoria-sync.service';
import { CategoriaController } from './categoria.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriaController],
  providers: [CategoriaService, CategoriaSyncService],
  exports: [CategoriaService, CategoriaSyncService],
})
export class CategoriaModule {}

/*
🗓 24/10/2025 - 18:40
🏗️ Estruturação do módulo Categoria.
--------------------------------------------
📘 Lógica:
- Agrupa serviços e controller relacionados a categorias.
- Expõe services para uso no Core (scheduler, sync geral, etc.).
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
