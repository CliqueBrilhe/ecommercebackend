// src/Bling/core/bling.controller.ts



import { Controller, Post, Headers, Logger, Body } from '@nestjs/common';
import { styledLog, logSeparator } from '../../utils/log-style.util';

@Controller('bling/core')
export class BlingController {
  private readonly logger = new Logger(BlingController.name);

  /**
   * 📩 Webhook principal (criação, atualização e remoção)
   * Recebe eventos do Bling ERP e registra logs detalhados.
   */
  @Post('webhook')
  async handleWebhook(
    @Body() body: any,
    @Headers() headers: Record<string, string>,
  ) {
    logSeparator('BLING WEBHOOK', 'magenta');
    this.logger.debug(
      `📦 Corpo bruto recebido:\n${JSON.stringify(body, null, 2)}`,
    );

    // 🚨 Validação inicial
    if (!body || Object.keys(body).length === 0) {
      styledLog(
        'warning',
        '⚠️ Webhook recebido com corpo vazio ou formato inválido.',
        'brightYellow',
      );
      return { ok: false, message: 'Empty or invalid payload' };
    }

    try {
      // 🔹 Normaliza payload (compatível v2/v3)
      const payload =
        body.data && typeof body.data === 'object' ? body.data : body;
      const event = body.event || 'unknown';
      const resource = body.resource || 'unknown';
      const id = Number(payload.id);

      styledLog(
        'webhook',
        `📬 Evento detectado: ${event} | Recurso: ${resource} | ID: ${id || 'N/A'}`,
        'cyan',
      );

      // 🔍 Identifica o tipo de operação
      if (!id || isNaN(id)) {
        styledLog(
          'warning',
          `⚠️ Payload sem ID válido. Evento: ${event}`,
          'brightYellow',
        );
        return { ok: false, message: 'Invalid or missing ID' };
      }

      const isDeleteEvent =
        event?.includes('deleted') ||
        (Object.keys(payload).length === 1 && 'id' in payload);

      if (isDeleteEvent) {
        styledLog(
          'webhook',
          `🗑️ Recurso removido no Bling (ID=${id})`,
          'red',
        );

        // 🚧 Futuro: emitir evento interno para remover localmente
        // await this.eventEmitter.emitAsync('bling.resource.deleted', { id, resource });

        return { ok: true, message: 'Resource deletion event received' };
      }

      // ✅ Caso de criação/atualização
      styledLog(
        'webhook',
        `♻️ Recurso atualizado/criado (ID=${id})`,
        'green',
      );

      // 🚧 Futuro: emitir evento interno com base no tipo de recurso
      // Example:
      // await this.eventEmitter.emitAsync('bling.resource.upsert', { resource, payload });

      return { ok: true, message: 'Webhook processed successfully' };
    } catch (error: any) {
      styledLog(
        'error',
        `❌ Erro ao processar webhook: ${error.message}`,
        'brightRed',
      );
      return { ok: false, error: error.message };
    }
  }
}


/*
🗓 24/10/2025 - 20:20
♻️ Refatoração: BlingController agora atua apenas no núcleo (core) de integração.
--------------------------------------------
📘 Lógica:
- Responsável exclusivamente por receber e tratar webhooks enviados pelo Bling.
- Gera logs estruturados e detalhados.
- Identifica eventos de criação, atualização e exclusão.
- Futuramente poderá acionar sincronizações específicas (ex: produto, contato, pedido).
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/