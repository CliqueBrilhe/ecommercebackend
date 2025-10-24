// src/Bling/catalogo/produtos/produto.controller.ts
import { Controller, Get, Post } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProdutoSyncService } from './produto-sync.service';
import { styledLog } from '../../../utils/log-style.util';

@Controller('bling/catalogo/produtos')
export class ProdutoController {
  constructor(
    private readonly produtoService: ProdutoService,
    private readonly syncService: ProdutoSyncService,
  ) {}

  @Get()
  async listarProdutosDireto() {
    styledLog('products', '🔍 Testando conexão com API do Bling...', 'cyan');
    return this.produtoService.getProducts();
  }

  @Post('sync')
  async sincronizarProdutos() {
    styledLog('products', '🚀 Sincronização manual de produtos iniciada...', 'brightCyan');
    return this.syncService.sincronizarProdutos();
  }
}

/*
🗓 24/10/2025 - 17:10
✨ Novo controller dedicado a produtos do Bling.
--------------------------------------------
📘 Lógica:
- Testa comunicação direta com o Bling (GET /produtos).
- Permite sincronização manual via POST /bling/catalogo/produtos/sync.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
