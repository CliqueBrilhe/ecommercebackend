// src/Bling/catalogo/categorias/categoria.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { blingCatalogHttp } from '../../Core/bling-http';

@Injectable()
export class CategoriaService {
  private readonly logger = new Logger(CategoriaService.name);

  /**
   * Busca categorias de produtos no Bling.
   * Retorna a lista completa de categorias com suas hierarquias.
   */
  async getCategories(): Promise<any[]> {
    try {
      const response = await blingCatalogHttp.get('/categorias/produtos', {
        headers: { Accept: 'application/json' },
      });
      const categorias = response.data?.data ?? [];

      this.logger.log(`📚 ${categorias.length} categorias obtidas da API do Bling.`);
      return categorias;
    } catch (err: any) {
      this.logger.error(
        '❌ Erro ao buscar categorias:',
        err.response?.data || err.message,
      );
      return [];
    }
  }
}

/*
🗓 24/10/2025 - 18:10
✨ Criação do CategoriaService.
--------------------------------------------
📘 Lógica:
- Faz requisição direta à API do Bling para buscar categorias.
- Retorna lista bruta para ser usada pelo CategoriaSyncService.
- Centraliza comunicação HTTP com /categorias/produtos.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
