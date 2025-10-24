// src/bling/core/bling.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlingController } from './Core/controllers/bling.controller';
import { BlingService } from './Core/services/bling.service';
import { BlingSyncModule } from './sync/bling-sync.module';

@Module({
  imports: [BlingSyncModule],
  controllers: [BlingController],
  providers: [BlingService],
  exports: [BlingService],
})
export class BlingModule {}








/*
🗓 16/10/2025
🔧 Refatoração: reorganização do módulo principal do Bling para se adequar à estrutura modular (core/sync/utils).
--------------------------------------------
📘 Lógica:
Este módulo gerencia a integração central com a API do Bling.
- Importa entidades locais (`Product`, `Category`) para sincronização de dados.
- Integra o módulo de sincronização (`BlingSyncModule`).
- Expõe controladores e serviços centrais para comunicação e sincronização.
by: gabbu (github: gabriellesote)
*/
