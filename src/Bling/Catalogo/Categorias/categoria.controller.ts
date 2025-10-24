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
    styledLog('categories', '🔍 Testando conexão com API do Bling...', 'cyan');
    return this.categoriaService.getCategories();
  }

  @Post('sync')
  async sincronizarCategorias() {
    styledLog('categories', '🚀 Sincronização manual de categorias iniciada...', 'brightCyan');
    return this.syncService.sincronizarCategorias();
  }
}

/*
🗓 24/10/2025 - 18:35
✨ Novo controller dedicado às categorias do Bling.
--------------------------------------------
📘 Lógica:
- GET /bling/catalogo/categorias → testa comunicação com a API.
- POST /bling/catalogo/categorias/sync → sincroniza manualmente.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
