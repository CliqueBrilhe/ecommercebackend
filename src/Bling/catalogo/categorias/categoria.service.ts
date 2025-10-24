// src/Bling/catalogo/categorias/categoria.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { blingCatalogHttp } from '../../core/bling-http';

@Injectable()
export class CategoriaService {
  private readonly logger = new Logger(CategoriaService.name);

  /**
   * 📚 Busca categorias de produtos no Bling.
   * Retorna a lista completa de categorias com hierarquia.
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
      this.logger.error('❌ Erro ao buscar categorias:', err.response?.data || err.message);
      return [];
    }
  }
}

/*
🗓 24/10/2025 - 23:00
✨ Melhoria: logs e estrutura padronizados.
--------------------------------------------
📘 Lógica:
- Comunicação direta com a API do Bling (GET /categorias/produtos).
- Retorna a lista de categorias com hierarquia.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
