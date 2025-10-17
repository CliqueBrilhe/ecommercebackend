// src/Bling/sync/controllers/sync.controller.ts
import { Controller, Post } from '@nestjs/common';
import { BlingCategoriasSyncService } from '../services/bling-categorias-sync.service';
import {  ApiOperation, ApiResponse} from '@nestjs/swagger';

@Controller('bling/sync')
export class SyncController {
  constructor(private readonly categoriasSyncService: BlingCategoriasSyncService) {}


  @Post('categorias')
  @ApiOperation({ summary: 'Sincroniza categorias do Bling' })
  @ApiResponse({ status: 200, description: 'Sincronização concluída com sucesso.' })
  async syncCategorias() {
    await this.categoriasSyncService.sincronizarCategorias();
    return { message: 'Sincronização de categorias concluída com sucesso.' };
  }
}

/*
🕓 17/10/2025 - endpoint para sincronização manual de categorias
--------------------------------------------
Lógica: dispara manualmente a sincronização das categorias via serviço dedicado.
by: gabbu (github: gabriellesote)
*/
