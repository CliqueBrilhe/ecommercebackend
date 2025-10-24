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
    styledLog('users', `🆕 Evento recebido: Usuário atualizado/criado (ID=${event.id})`, 'green');
    await this.usuarioSync.upsertFromWebhook(event.payload);
  }

  @OnEvent('bling.usuarios.deleted')
  async handleDelete(event: { id: number }) {
    styledLog('users', `🗑️ Evento recebido: Usuário removido (ID=${event.id})`, 'red');
    await this.usuarioSync.removeByBlingId(event.id);
  }
}

/*
🗓 24/10/2025 - 23:30
✨ Novo listener para eventos de usuários.
--------------------------------------------
📘 Lógica:
- Escuta eventos "bling.usuarios.upsert" e "bling.usuarios.deleted".
- Cria/atualiza ou remove usuários conforme o evento.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
