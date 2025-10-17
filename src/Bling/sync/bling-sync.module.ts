// src/Bling/sync/bling-sync.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../Modules/Category/entities/category.entity';
import { BlingService } from '../core/services/bling.service';
import { BlingCategoriasSyncService } from './services/bling-categorias-sync.service';
import { SyncController } from './controllers/sync.controller';
import { BlingProdutosSyncService } from './services/bling-produtos-sync.service';
import { Product } from '@product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  controllers: [SyncController],
  providers: [BlingService, BlingCategoriasSyncService, BlingProdutosSyncService],
})
export class BlingSyncModule {}

/*
🕓 17/10/2025 - módulo da sincronização de categorias
--------------------------------------------
Lógica: integra o serviço e o controller responsáveis pela
sincronização manual das categorias do Bling.
by: gabbu (github: gabriellesote)
*/
