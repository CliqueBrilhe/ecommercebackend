// src/Bling/usuario/usuario.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UsuarioSyncService } from './usuario-sync.service';
import { styledLog } from '../../utils/log-style.util';

@Injectable()
export class UsuarioListener {
  constructor(private readonly usuarioSync: UsuarioSyncService) {}

  @OnEvent('bling.usuarios.upsert')
  async handleUpsert(event: { id: number; payload: any }) {
    try {
      styledLog('users', `🆕 Evento recebido: Usuário atualizado/criado (ID=${event.id})`, 'green');
      await this.usuarioSync.upsertFromWebhook(event.payload);
      styledLog('users', `✅ Evento upsert concluído (ID=${event.id})`, 'brightGreen');
    } catch (err: any) {
      styledLog('users', `❌ Erro ao processar evento upsert: ${err.message}`, 'brightRed');
    }
  }

  @OnEvent('bling.usuarios.deleted')
  async handleDelete(event: { id: number }) {
    try {
      styledLog('users', `🗑️ Evento recebido: Usuário removido (ID=${event.id})`, 'red');
      await this.usuarioSync.removeByBlingId(event.id);
      styledLog('users', `✅ Evento delete concluído (ID=${event.id})`, 'brightGreen');
    } catch (err: any) {
      styledLog('users', `❌ Erro ao processar evento delete: ${err.message}`, 'brightRed');
    }
  }
}

/*
🗓 25/10/2025 - 02:10
💪 Melhoria: tratamento de erros e logs padronizados no listener de usuários.
--------------------------------------------
📘 Lógica:
- Escuta "bling.usuarios.upsert" e "bling.usuarios.deleted".
- Cria/atualiza ou remove usuários conforme evento.
- Adiciona segurança extra com try/catch e logs de confirmação.
by: gabbu (github: gabriellesote) ✧
*/
