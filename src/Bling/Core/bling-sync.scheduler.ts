// src/Bling/core/bling-sync.scheduler.ts

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { performance } from 'perf_hooks';
import { CategoriaSyncService } from '../Catalogo/Categorias/categoria-sync.service';
import { ProdutoSyncService } from '../Catalogo/Produtos/produto-sync.service';
import { SyncLog } from './entities/sync-log.entity';
import {
  styledLog,
  colors,
  moduleIcons,
  logSeparator,
} from '../../utils/log-style.util';

@Injectable()
export class BlingSyncScheduler {
  private readonly isDev = process.env.NODE_ENV === 'development';
  private readonly frequencyLabel = this.isDev ? '5 minutos' : '1 hora';

  constructor(
    private readonly categoriaSync: CategoriaSyncService,
    private readonly produtoSync: ProdutoSyncService,
    @InjectRepository(SyncLog)
    private readonly syncLogRepository: Repository<SyncLog>,
  ) {}

  /**
   * Registra logs de sincronização no banco de dados.
   */
  private async registrarLog(
    module: 'products' | 'categories',
    createdCount: number,
    updatedCount: number,
  ) {
    const log = this.syncLogRepository.create({
      type: 'automatic',
      module,
      createdCount,
      updatedCount,
    });

    await this.syncLogRepository.save(log);

    styledLog(
      'sync',
      `🗒️ Log registrado para módulo: ${module} | Criados: ${createdCount} | Atualizados: ${updatedCount}`,
      'brightCyan',
    );
  }

  /**
   * Executa sincronização automática com o Bling.
   */
  @Cron(
    process.env.NODE_ENV === 'development'
      ? CronExpression.EVERY_5_MINUTES
      : CronExpression.EVERY_HOUR,
  )
  async runScheduledSync() {
    const envLabel = this.isDev
      ? `${colors.cyan}${colors.bold}🧪 DEV${colors.reset}`
      : `${colors.yellow}${colors.bold}☁️ PRODUÇÃO${colors.reset}`;

    logSeparator('SYNC AUTO');
    styledLog(
      'sync',
      `⚙️ [${envLabel}] Iniciando sincronização automática do Bling...`,
      this.isDev ? 'brightCyan' : 'yellow',
    );

    try {
      const totalStart = performance.now();

      // ============================
      // 1️⃣ Sincronização de Categorias
      // ============================
      logSeparator('CATEGORIES');
      const startCats = performance.now();
      const resultCats = await this.categoriaSync.sincronizarCategorias();
      const timeCats = ((performance.now() - startCats) / 1000).toFixed(2);

      styledLog(
        'categories',
        `${moduleIcons.categories} Categorias sincronizadas em ${timeCats}s | Criadas: ${resultCats.createdCount} | Atualizadas: ${resultCats.updatedCount}`,
        'cyan',
      );

      await this.registrarLog(
        'categories',
        resultCats.createdCount,
        resultCats.updatedCount,
      );

      // ============================
      // 2️⃣ Sincronização de Produtos
      // ============================
      logSeparator('PRODUCTS');
      const startProds = performance.now();
      const resultProds = await this.produtoSync.sincronizarProdutos();
      const timeProds = ((performance.now() - startProds) / 1000).toFixed(2);

      styledLog(
        'products',
        `${moduleIcons.products} Produtos sincronizados em ${timeProds}s | Criados: ${resultProds.createdCount} | Atualizados: ${resultProds.updatedCount}`,
        'green',
      );

      await this.registrarLog(
        'products',
        resultProds.createdCount,
        resultProds.updatedCount,
      );

      // ============================
      // 3️⃣ Tempo total e finalização
      // ============================
      logSeparator('SUMMARY');
      const totalTime = ((performance.now() - totalStart) / 1000).toFixed(2);
      const countdown = this.isDev ? '🕔 05:00' : '🕐 01:00:00';

      styledLog(
        'sync',
        `${moduleIcons.success} Sincronização concluída com sucesso! Tempo total: ${totalTime}s | Próxima execução em ${this.frequencyLabel} ${countdown}.`,
        'brightGreen',
      );
    } catch (error: any) {
      styledLog(
        'sync',
        `${moduleIcons.error} Erro na sincronização automática (a cada ${this.frequencyLabel}): ${error?.message || error}`,
        'brightRed',
      );
    }
  }
}


/*
🗓 24/10/2025 - 19:15
♻️ Refatoração: compatibilização com estrutura modular (catalogo/produtos e categorias).
--------------------------------------------
📘 Lógica:
- Usa CategoriaSyncService e ProdutoSyncService do módulo Catalogo.
- Mantém logs visuais com styledLog() e separadores.
- Executa sync automático com intervalos dinâmicos (5min dev / 1h prod).
- Registra logs no banco via SyncLog entity.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
