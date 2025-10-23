// src/Bling/sync/controllers/sync.controller.ts
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Controller, Post, Get } from '@nestjs/common';
import { BlingCategoriasSyncService } from '../services/bling-categorias-sync.service';
import { BlingProdutosSyncService } from '../services/bling-produtos-sync.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SyncLog} from '../entities/sync-log.entity';
import { logSeparator } from '../../../utils/log-style.util';


@Controller('bling/sync')
export class SyncController {
  constructor(
    private readonly categoriasSyncService: BlingCategoriasSyncService,
    private readonly produtosSyncService: BlingProdutosSyncService,
    @InjectRepository(SyncLog)
    private readonly syncLogRepository: Repository<SyncLog>,
  ) {}

  @Post('categorias')
  @ApiOperation({ summary: 'Sincroniza categorias do Bling' })
  @ApiResponse({
    status: 200,
    description: 'Sincronização concluída com sucesso.',
  })
  async syncCategorias() {
    logSeparator('SYNC MANUAL - CATEGORIAS');
    await this.categoriasSyncService.sincronizarCategorias();
    logSeparator('END SYNC');
    return { message: 'Sincronização de categorias concluída com sucesso.' };
  }

  @Post('produtos')
  @ApiOperation({ summary: 'Sincroniza produtos do Bling' })
  @ApiResponse({
    status: 200,
    description: 'Sincronização concluída com sucesso.',
  })
  async syncProdutos() {
    logSeparator('SYNC MANUAL - PRODUTOS');

    await this.produtosSyncService.sincronizarProdutos();
    logSeparator('END SYNC');

    return { message: 'Sincronização de produtos concluída com sucesso.' };
  }


@Get('status')
async getSyncStatus() {
  const lastLog = await this.syncLogRepository.find({
    order: { executedAt: 'DESC' },
    take: 5,
  });

  return {
    message: 'Últimos registros de sincronização',
    count: lastLog.length,
    data: lastLog,
  };

}

}

/*
🕓 17/10/2025 - endpoint para sincronização manual de categorias
--------------------------------------------
Lógica: dispara manualmente a sincronização das categorias via serviço dedicado.
by: gabbu (github: gabriellesote)
*/
