// src/Bling/catalogo/categorias/categoria.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CategoriaSyncService } from './categoria-sync.service';
import { styledLog } from '../../../utils/log-style.util';

@Injectable()
export class CategoriaListener {
  constructor(private readonly categoriaSync: CategoriaSyncService) {}

  @OnEvent('bling.categorias.upsert')
  async handleUpsert(event: { id: number; payload: any }) {
    styledLog('categories', `🆕 Evento recebido: Categoria atualizada/criada (ID=${event.id})`, 'green');
    await this.categoriaSync.upsertFromWebhook(event.payload);
  }

  @OnEvent('bling.categorias.deleted')
  async handleDelete(event: { id: number }) {
    styledLog('categories', `🗑️ Evento recebido: Categoria removida (ID=${event.id})`, 'red');
    await this.categoriaSync.removeByBlingId(event.id);
  }
}

/*
🗓 24/10/2025 - 23:00
✨ Novo listener para eventos de categorias.
--------------------------------------------
📘 Lógica:
- Escuta eventos emitidos pelo CoreBlingModule.
- upsert → cria/atualiza categoria.
- deleted → remove categoria.
- Usa logs padronizados e coloridos.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
