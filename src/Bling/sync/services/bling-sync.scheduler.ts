// src/Bling/sync/services/bling-sync.scheduler.ts

/*
🗓 22/10/2025 - 16:30
💅 Refatoração: integração total com log-style.util.ts.
--------------------------------------------
📘 Lógica:
- Usa styledLog() e cores ANSI para logs visuais e padronizados.
- Mostra ícones, tempos de execução e ambiente colorido.
- Mantém registro no banco (SyncLog) com contagens de criação/atualização.
- Intervalo dinâmico (5min dev / 1h prod).
edit by: gabbu (gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/

import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { performance } from 'perf_hooks';
import { BlingCategoriasSyncService } from './bling-categorias-sync.service';
import { BlingProdutosSyncService } from './bling-produtos-sync.service';
import { SyncLog } from '../entities/sync-log.entity';
import {
  styledLog,
  colors,
  moduleIcons,
  logSeparator,
} from '../../../utils/log-style.util';

@Injectable()
export class BlingSyncScheduler {
  private readonly isDev = process.env.NODE_ENV === 'development';
  private readonly frequencyLabel = this.isDev ? '5 minutos' : '1 hora';

  constructor(
    private readonly categoriasSync: BlingCategoriasSyncService,
    private readonly produtosSync: BlingProdutosSyncService,
    @InjectRepository(SyncLog)
    private readonly syncLogRepository: Repository<SyncLog>,
  ) {}

  // 🔹 Função auxiliar para salvar logs no banco
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

  // 🔹 CRON job principal (a cada 5 min em dev / 1h em prod)
  @Cron(
    process.env.NODE_ENV === 'development'
      ? CronExpression.EVERY_5_MINUTES
      : CronExpression.EVERY_HOUR,
  )
  async runScheduledSync() {
    // Ambiente colorido
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
      const resultCats = await this.categoriasSync.sincronizarCategorias();
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
      const resultProds = await this.produtosSync.sincronizarProdutos();
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
