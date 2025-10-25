// src/Bling/Core/bling.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { BlingController } from './core/bling.controller';
import { BlingSyncScheduler } from './core/bling-sync.scheduler';
import { SyncLog } from './core/entities/sync-log.entity';

// ✅ importa o módulo que contém os serviços de categoria/produto
import { CatalogoModule } from '../Bling/catalogo/catalogo.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([SyncLog]),
    EventEmitterModule.forRoot(),

    // ✅ IMPORTANTE: adiciona o catálogo
    CatalogoModule,
  ],
  controllers: [BlingController],
  providers: [BlingSyncScheduler],
  exports: [
    EventEmitterModule,
    BlingSyncScheduler,
  ],
})
export class CoreBlingModule {}

/*
🗓 25/10/2025 - 13:40
🚑 Correção: adicionada importação do CatalogoModule no CoreBlingModule.
--------------------------------------------
📘 Lógica:
- O BlingSyncScheduler depende de CategoriaSyncService e ProdutoSyncService.
- Ambos pertencem ao CatalogoModule.
- Importar o módulo resolve o ciclo de dependência e permite injeção correta.
by: gabbu (github: gabriellesote) ✧
*/
