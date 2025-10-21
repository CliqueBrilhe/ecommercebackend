 // src/Bling/sync/services/bling-produtos-sync.scheduler.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BlingProdutosSyncService } from './bling-produtos-sync.service';

@Injectable()
export class BlingProdutosSyncScheduler {
  private readonly logger = new Logger(BlingProdutosSyncScheduler.name);

  constructor(private readonly produtosSync: BlingProdutosSyncService) {}

  // ⏰ roda automaticamente todo início de hora
  @Cron(CronExpression.EVERY_HOUR)
  async runHourlySync() {
    this.logger.log('⏰ CRON: iniciando sincronização horária de produtos...');
    await this.produtosSync.sincronizarProdutos();
    this.logger.log('✅ CRON: sincronização horária concluída.');
  }
}

/*
🗓 21/10/2025 - 11:25
🔧 Criação: scheduler para rodar sincronização de produtos a cada 1 hora (Nest Schedule).
--------------------------------------------
📘 Lógica:
Usa @nestjs/schedule com CronExpression.EVERY_HOUR para disparar a sincronização completa.
edit by: gabbu (gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
