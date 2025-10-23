// src/Bling/sync/bling-sync.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../Modules/Category/entities/category.entity';
import { BlingService } from '../core/services/bling.service';
import { BlingCategoriasSyncService } from './services/bling-categorias-sync.service';
import { SyncController } from './controllers/sync.controller';
import { BlingProdutosSyncService } from './services/bling-produtos-sync.service';
import { Product } from '@product/product.entity';

import { SyncLog } from './entities/sync-log.entity';
import { BlingSyncScheduler } from './services/bling-sync.scheduler';
// import { BlingAutoSyncService } from './services/bling-auto-sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, SyncLog])],
  controllers: [SyncController],
  providers: [
    BlingSyncScheduler,
    BlingService,
    BlingCategoriasSyncService,
    BlingProdutosSyncService,
    
  ],
  exports: [BlingProdutosSyncService],
})
export class BlingSyncModule {}

/*
🕓 17/10/2025 - add o módulo da sincronização de categorias
🕓 20/10/2025 - add o módulo da sincronização automatica
--------------------------------------------
Lógica: integra o serviço e o controller responsáveis pela
sincronização manual das categorias do Bling.
by: gabbu (github: gabriellesote)
*/
