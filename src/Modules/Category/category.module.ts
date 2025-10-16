// src/category/category.module.ts
// src/category/category.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { BlingSyncModule } from '../../Bling/sync/sync.module';
import { BlingCategoriasSyncService } from '../../Bling/sync/services/bling-categorias-sync.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    BlingSyncModule, // ✅ importa o módulo que fornece BlingCategoriasService
  ],
  controllers: [CategoryController],
  providers: [CategoryService, BlingCategoriasSyncService],
  exports: [BlingCategoriasSyncService],
})
export class CategoryModule {}


// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração de nomenclaturas para inglês (module, entity, controller e service)
// --------------------------------------------------------------
// Explicação da lógica:
// Este módulo agrupa a configuração do TypeORM para a entidade Category,
// além de fornecer o controller e service para gerenciar categorias de produtos.
// by: gabbu (github: gabriellesote)
