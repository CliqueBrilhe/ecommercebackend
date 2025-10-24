// src/Bling/catalogo/categorias/categoria.controller.ts
import { Controller, Get, Post } from '@nestjs/common';
import { CategoriaService } from './categoria.service';
import { CategoriaSyncService } from './categoria-sync.service';
import { styledLog } from '../../../utils/log-style.util';

@Controller('bling/catalogo/categorias')
export class CategoriaController {
  constructor(
    private readonly categoriaService: CategoriaService,
    private readonly syncService: CategoriaSyncService,
  ) {}

  @Get()
  async listarCategoriasDireto() {
    styledLog('categories', '🔍 Testando conexão com a API do Bling...', 'cyan');
    return this.categoriaService.getCategories();
  }

  @Post('sync')
  async sincronizarCategorias() {
    styledLog('categories', '🚀 Sincronização manual de categorias iniciada...', 'brightCyan');
    return this.syncService.sincronizarCategorias();
  }
}

/*
🗓 24/10/2025 - 23:00
✅ Controlador revisado e padronizado.
--------------------------------------------
📘 Lógica:
- GET: testa comunicação direta com API do Bling.
- POST /sync: executa sincronização manual de categorias.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
