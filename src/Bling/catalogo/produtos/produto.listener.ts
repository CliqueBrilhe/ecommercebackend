// src/Bling/catalogo/produtos/produto.listener.ts
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProdutoSyncService } from './produto-sync.service'; // ✅ nome corrigido
import { styledLog } from '../../../utils/log-style.util';

@Injectable()
export class ProdutoListener {
  constructor(private readonly produtosSync: ProdutoSyncService) {} // ✅ nome corrigido

  // Escuta criação/atualização de produtos
  @OnEvent('bling.produtos.upsert')
  async handleUpsert(event: { id: number; payload: any }) {
    styledLog(
      'products',
      `🆕 Evento recebido: Produto atualizado/criado ID=${event.id}`,
      'green',
    );
    await this.produtosSync.upsertFromWebhook(event.payload);
  }

  // Escuta exclusão
  @OnEvent('bling.produtos.deleted')
  async handleDelete(event: { id: number }) {
    styledLog(
      'products',
      `🗑️ Evento recebido: Produto removido ID=${event.id}`,
      'red',
    );
    await this.produtosSync.removeByBlingId(event.id);
  }
}

/*
🗓 24/10/2025 - 22:30
🧩 Correção: importação e injeção ajustadas de BlingProdutosSyncService → ProdutoSyncService.
--------------------------------------------
📘 Lógica:
- O listener reage automaticamente aos eventos emitidos pelo CoreBlingModule.
- Evento `bling.produtos.upsert` → atualiza/cria produto.
- Evento `bling.produtos.deleted` → remove produto.
- Usa logs padronizados e coloridos via styledLog().
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
