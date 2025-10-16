// src/Bling/sync/sync.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../Modules/Category/entities/category.entity';
import { BlingCategoriasService } from '../../Bling/core/services/bling-categorias.service';
import { BlingCategoriasSyncService } from './services/bling-categorias-sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [BlingCategoriasService, BlingCategoriasSyncService],
  exports: [BlingCategoriasService, BlingCategoriasSyncService], // ✅ exporta os serviços
})
export class BlingSyncModule {}
