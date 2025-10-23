// src/Bling/core/bling.controller.ts

/*
🗓 22/10/2025 - 17:40
✨ Refatoração completa do webhook do Bling:
- Adicionado log detalhado do corpo bruto.
- Tratamento unificado para event / operation / resource.
- Padronização com styledLog() e cores ANSI.
- Verificação de parsing do body e tratamento de erros silenciosos.
--------------------------------------------
📘 Lógica:
Recebe eventos de webhook do Bling e dispara atualizações locais de produtos.
Compatível com diferentes formatos de payload (v2/v3).
by: gabbu (github: gabriellesote)
*/

import { Controller, Get, Post, Headers, Logger, Body } from '@nestjs/common';
import { BlingService } from '../services/bling.service';
import { BlingProdutosSyncService } from '../../sync/services/bling-produtos-sync.service';
import { styledLog, colors } from '../../../utils/log-style.util';

@Controller('bling')
export class BlingController {
  private readonly logger = new Logger(BlingController.name);

  constructor(
    private readonly blingService: BlingService,
    private readonly produtosSync: BlingProdutosSyncService,
  ) {}

  // 🔍 Endpoint para testes diretos com a API do Bling
  @Get('produtos')
  async getProdutosDireto() {
    styledLog('products', '🔍 Testando comunicação direta com API de produtos...', 'cyan');
    return this.blingService.getProducts();
  }

  @Get('categorias')
  async getCategoriasDireto() {
    styledLog('categories', '🔍 Testando comunicação direta com API de categorias...', 'cyan');
    return this.blingService.getCategories();
  }

  // 📩 Webhook principal (criação, atualização e remoção)
  @Post('webhook')
  async handleWebhook(@Body() body: any, @Headers() headers: Record<string, string>) {
    // Loga o corpo cru para diagnóstico
    this.logger.debug(`📦 Corpo bruto do webhook:\n${JSON.stringify(body, null, 2)}`);

    if (!body || Object.keys(body).length === 0) {
      styledLog('warning', '⚠️ Webhook recebido com corpo vazio ou formato inválido.', 'brightYellow');
      return { ok: false, message: 'Empty or invalid payload' };
    }

    // Detecta nome do evento (pode vir como event, operation, ou resource)
    const event = body.event || body.operation || null;
    const resource = body.resource || 'unknown';
    const id = body?.data?.id ?? null;

    styledLog('sync', `📩 Webhook recebido: ${event ?? 'sem evento'} | recurso: ${resource} | id=${id ?? 'null'}`, 'brightCyan');

    try {
      // Trata evento de produto
      if (resource === 'produto' || event?.includes('product')) {
        if (event?.includes('created') || body.operation === 'created') {
          styledLog('products', `🆕 Produto criado (ID=${id})`, 'green');
          await this.produtosSync.upsertFromWebhook(body.data);
        } else if (event?.includes('updated') || body.operation === 'updated') {
          styledLog('products', `♻️ Produto atualizado (ID=${id})`, 'brightGreen');
          await this.produtosSync.upsertFromWebhook(body.data);
        } else if (event?.includes('deleted') || body.operation === 'deleted') {
          styledLog('products', `🗑️ Produto removido (ID=${id})`, 'red');
          await this.produtosSync.removeByBlingId(id);
        } else {
          styledLog('warning', `⚠️ Operação de produto não reconhecida: ${event}`, 'brightYellow');
        }
      } else {
        styledLog('warning', `⚠️ Webhook recebido de recurso não tratado: ${resource}`, 'brightYellow');
      }
    } catch (error: any) {
      styledLog('error', `❌ Erro ao processar webhook do Bling: ${error.message}`, 'brightRed');
      return { ok: false, error: error.message };
    }

    return { ok: true };
  }
}
