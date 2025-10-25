// src/Bling/Core/core-bling.module.ts

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { BlingController } from './bling.controller';
import { BlingSyncScheduler } from './bling-sync.scheduler';
import { SyncLog } from './entities/sync-log.entity';

import { CatalogoModule } from 'Bling/catalogo/catalogo.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([SyncLog]),
    EventEmitterModule.forRoot(),
    CatalogoModule, 
  ],
  controllers: [BlingController],
  providers: [BlingSyncScheduler],
  exports: [EventEmitterModule], // 🔄 Exporta para outros módulos (produto, venda, etc.)
})
export class CoreBlingModule {}
