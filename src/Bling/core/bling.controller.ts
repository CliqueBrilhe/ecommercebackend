// src/Bling/Core/bling.controller.ts
import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { styledLog, logSeparator } from '../../utils/log-style.util';

/**
 * Enum centralizado para os tipos de eventos do Bling
 */
export enum BlingEventType {
  UPSERT = 'upsert',
  DELETED = 'deleted',
}

@Controller('bling/core')
export class BlingController {
  private readonly logger = new Logger(BlingController.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * 📩 Webhook principal do Bling
   * Recebe eventos de qualquer recurso (produtos, contatos, vendas, etc.)
   * e emite eventos internos no sistema para os módulos ouvintes.
   */
  @Post('webhook')
  async handleWebhook(@Body() body: any, @Headers() headers: Record<string, string>) {
    logSeparator('WEBHOOK BLING', 'magenta');

    const payload = body.data && typeof body.data === 'object' ? body.data : body;
    const evento = body.event || 'desconhecido';
    const recurso = body.resource || 'desconhecido';
    const id = Number(payload.id);

    styledLog(
      'webhook',
      `📬 Evento recebido do Bling → Tipo: ${evento} | Recurso: ${recurso} | ID: ${id}`,
      'cyan',
    );

    // 🚨 Validação
    if (!id || isNaN(id)) {
      styledLog('warning', '⚠️ ID inválido ou ausente no payload.', 'brightYellow');
      return { ok: false, message: 'ID inválido' };
    }

    // 🗑️ Exclusão
    const exclusao =
      evento?.includes(BlingEventType.DELETED) ||
      (Object.keys(payload).length === 1 && 'id' in payload);

    if (exclusao) {
      styledLog('webhook', `🗑️ Recurso removido no Bling (ID=${id})`, 'red');
      this.eventEmitter.emit(`bling.${recurso}.${BlingEventType.DELETED}`, { id, recurso });
      return { ok: true, message: 'Evento de exclusão processado' };
    }

    // ♻️ Criação ou atualização
    styledLog('webhook', `♻️ Recurso criado ou atualizado (ID=${id})`, 'green');
    this.eventEmitter.emit(`bling.${recurso}.${BlingEventType.UPSERT}`, { id, payload });

    return { ok: true, message: 'Evento emitido com sucesso' };
  }
}

/*
🗓 24/10/2025 - 22:10
♻️ Refatoração: logs em português e enum de eventos padronizado.
--------------------------------------------
📘 Lógica:
- Recebe webhooks universais do Bling (para qualquer tipo de recurso).
- Emite eventos internos no formato `bling.<recurso>.<ação>`.
- Ações possíveis: `upsert` (criação/atualização) e `deleted` (remoção).
- Totalmente desacoplado, permitindo que cada módulo (produtos, usuários, vendas)
  escute apenas os eventos que lhe interessam via @OnEvent().
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧ +
*/
