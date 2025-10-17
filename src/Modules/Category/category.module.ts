// src/category/category.module.ts
// src/category/category.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
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
