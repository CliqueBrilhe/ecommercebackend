// src/Bling/catalogo/categorias/categoria.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../../Modules/Category/entities/category.entity';
import { CategoriaService } from './categoria.service';
import { CategoriaSyncService } from './categoria-sync.service';
import { CategoriaController } from './categoria.controller';
import { CategoriaListener } from './categoria.listener';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriaController],
  providers: [CategoriaService, CategoriaSyncService, CategoriaListener],
  exports: [CategoriaService, CategoriaSyncService],
})
export class CategoriaModule {}

/*
🗓 24/10/2025 - 23:00
✅ Atualização: listener adicionado ao módulo.
--------------------------------------------
📘 Lógica:
- Declara serviço, sync e listener de categorias.
- Exporta serviços para uso no módulo catálogo.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
