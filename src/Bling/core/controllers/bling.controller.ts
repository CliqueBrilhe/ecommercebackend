// src/Bling/core/bling.controller.ts
import { Controller, Get, Post, Headers, Logger, Body } from '@nestjs/common';
import { BlingService } from '../services/bling.service';
import { BlingProdutosSyncService } from '../../sync/services/bling-produtos-sync.service'; // 👈 importa o serviço de sync

@Controller('bling')
export class BlingController {
  private readonly logger = new Logger(BlingController.name);

  constructor(
    private readonly blingService: BlingService,
    private readonly produtosSync: BlingProdutosSyncService, // 👈 injeta o serviço aqui
  ) {}

  // Endpoint para testar a comunicação direta com a API da Bling
  @Get('produtos')
  async getProdutosDireto() {
    return this.blingService.getProducts();
  }

  @Get('categorias')
  async getCategoriasDireto() {
    return this.blingService.getCategories();
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any, @Headers() headers: Record<string, string>) {
    this.logger.log(`📩 Webhook: ${body?.event} | id=${body?.data?.id}`);

    switch (body?.event) {
      case 'product.created':
      case 'product.updated':
        await this.produtosSync.upsertFromWebhook(body.data);
        break;
      case 'product.deleted':
        await this.produtosSync.removeByBlingId(body?.data?.id);
        break;
      default:
        this.logger.warn(`Evento não tratado: ${body?.event}`);
    }

    return { ok: true };
  }
}

/*
🗓 21/10/2025
🔧 Correção: adicionada injeção do BlingProdutosSyncService no construtor do controller.
--------------------------------------------
📘 Lógica:
Controlador principal da integração com o Bling.
Agora reage a eventos de criação/atualização/remoção de produtos recebidos via webhook,
chamando o serviço de sincronização local.
by: gabbu (github: gabriellesote)
*/
