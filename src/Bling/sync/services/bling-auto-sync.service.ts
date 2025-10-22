// // src/Bling/sync/services/bling-auto-sync.service.ts
// import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { SyncLog } from '../entities/sync-log.entity';
// import { BlingProdutosSyncService } from './bling-produtos-sync.service';
// import { BlingCategoriasSyncService } from './bling-categorias-sync.service';

// @Injectable()
// export class BlingAutoSyncService {
//   private readonly logger = new Logger(BlingAutoSyncService.name);

//   constructor(
//     private readonly produtosSync: BlingProdutosSyncService,
//     private readonly categoriasSync: BlingCategoriasSyncService,
//     @InjectRepository(SyncLog)
//     private readonly syncLogRepository: Repository<SyncLog>,
//   ) {}

//   /**
//    * Executa sincronização automática de categorias e produtos.
//    * Roda a cada 5 minutos (pode ser ajustado).
//    */
//   @Cron(CronExpression.EVERY_5_MINUTES)
//   async executarAutoSync() {
//     this.logger.log('⚙️ Executando sincronização automática com o Bling...');

//     try {
//       await this.categoriasSync.sincronizarCategorias();
//       await this.produtosSync.sincronizarProdutos();

//       const log = this.syncLogRepository.create({
//         type: 'automatic',
//         module: 'products',
//         createdCount: 0,
//         updatedCount: 0,
//       });
//       await this.syncLogRepository.save(log);

//       this.logger.log('✅ Sincronização automática concluída.');
//     } catch (error) {
//       this.logger.error('❌ Erro na sincronização automática:', error.message);
//     }
//   }
// }

// /*
// 🕓 17/10/2025 - criação do serviço de sincronização automática
// --------------------------------------------
// Lógica: executa sincronização de produtos e categorias a cada 5 minutos,
// usando o agendador do NestJS. Registra logs na tabela sync_log.
// by: gabbu (github: gabriellesote)
// */
