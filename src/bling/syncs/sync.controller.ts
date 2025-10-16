// src/syncs/sync.controller.ts
import { Controller, Post, Logger } from '@nestjs/common';
import { BlingProdutosSyncService } from './bling-prudutos-sync.service';
import { BlingCategoriasSyncService } from './bling-categorias-sync.service';

@Controller('sync')
export class SyncController {
  private readonly logger = new Logger(SyncController.name);

  constructor(
    private readonly produtosSync: BlingProdutosSyncService,
    private readonly categoriasSync: BlingCategoriasSyncService,
  ) {}

  /**
   * Endpoint para sincronizar todas as categorias do Bling.
   * POST /sync/categorias
   */
  @Post('categorias')
  async syncCategorias() {
    this.logger.log('Iniciando sincronização de categorias via endpoint...');
    await this.categoriasSync.sincronizarCategorias();
    return { message: 'Sincronização de categorias concluída.' };
  }

  /**
   * Endpoint para sincronizar todos os produtos do Bling.
   * POST /sync/produtos
   */
  @Post('produtos')
  async syncProdutos() {
    this.logger.log('Iniciando sincronização de produtos via endpoint...');
    await this.produtosSync.sincronizarProdutos();
    return { message: 'Sincronização de produtos concluída.' };
  }
}
