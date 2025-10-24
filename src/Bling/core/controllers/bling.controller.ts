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
import { styledLog, colors, logSeparator } from '../../../utils/log-style.util';

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
    styledLog(
      'products',
      '🔍 Testando comunicação direta com API de produtos...',
      'cyan',
    );
    return this.blingService.getProducts();
  }

  @Get('usuarios')
  async getUsuarios() {
    styledLog(
      'users',
      '🔍 Testando comunicação direta com API de produtos...',
      'white',
    );
    return this.blingService.getUsers();
  }

  @Get('categorias')
  async getCategoriasDireto() {
    styledLog(
      'categories',
      '🔍 Testando comunicação direta com API de categorias...',
      'cyan',
    );
    return this.blingService.getCategories();
  }

  // 📩 Webhook principal (criação, atualização e remoção)
  // 📩 Webhook principal (criação, atualização e remoção)
  @Post('webhook')
  async handleWebhook(
    @Body() body: any,
    @Headers() headers: Record<string, string>,
  ) {
    logSeparator('WEBHOOK PRODUTO', 'magenta');
    this.logger.debug(
      `📦 Corpo bruto do webhook:\n${JSON.stringify(body, null, 2)}`,
    );

    if (!body || Object.keys(body).length === 0) {
      styledLog(
        'warning',
        '⚠️ Webhook recebido com corpo vazio ou formato inválido.',
        'brightYellow',
      );
      return { ok: false, message: 'Empty or invalid payload' };
    }

    try {
      // 🔹 Detecta formato do payload
      const payload =
        body.data && typeof body.data === 'object' ? body.data : body;
      const event = body.event || 'unknown';
      const id = Number(payload.id);

      if (!id || isNaN(id)) {
        styledLog(
          'warning',
          `⚠️ Payload recebido sem ID válido de produto. Evento: ${event}`,
          'brightYellow',
        );
        return { ok: false, message: 'Invalid or missing product ID' };
      }

      // 🔍 Detecta tipo de evento
      const isDeleteEvent =
        event?.includes('deleted') ||
        (Object.keys(payload).length === 1 && 'id' in payload);

      if (isDeleteEvent) {
        styledLog('products', `🗑️ Produto removido (BlingID=${id})`, 'red');
        await this.produtosSync.removeByBlingId(id);
        return { ok: true, message: 'Product deleted successfully' };
      }

      // 🔹 Mapeia status do Bling "E" (inativo) para o backend
      if (payload.situacao === 'E') payload.situacao = 'I';

      // 🆕 Criação / Atualização
      const { result } = await this.produtosSync.upsertFromWebhook(payload);

      if (result === 'created') {
        styledLog(
          'products',
          `🆕 Produto criado via webhook: ${payload.nome} (BlingID=${id})`,
          'brightGreen',
        );
      } else {
        styledLog(
          'products',
          `♻️ Produto atualizado via webhook: ${payload.nome} (BlingID=${id})`,
          'green',
        );
      }

      return { ok: true, message: 'Product upserted successfully' };
    } catch (error: any) {
      styledLog(
        'error',
        `❌ Erro ao processar webhook do Bling: ${error.message}`,
        'brightRed',
      );
      return { ok: false, error: error.message };
    }
  }
}
