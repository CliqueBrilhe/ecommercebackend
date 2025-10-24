// src/Bling/catalogo/produtos/produto.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { blingCatalogHttp } from '../../utils/bling-http';

@Injectable()
export class ProdutoService {
  private readonly logger = new Logger(ProdutoService.name);

  /**
   * Busca produtos do Bling com suporte a paginação.
   * Retorna produtos da página atual + se há próxima página.
   */
  async getProducts(page = 1) {
    try {
      const response = await blingCatalogHttp.get('/produtos', {
        params: { pagina: page, criterio: 5 },
        headers: { Accept: 'application/json' },
      });

      const produtos = response.data?.data ?? [];
      const hasNext = response.data?.hasNext ?? false;

      this.logger.log(
        `📦 Página ${page} carregada (${produtos.length} produtos) | hasNext=${hasNext}`,
      );

      return { produtos, hasNext };
    } catch (err: any) {
      this.logger.error(
        '❌ Erro ao buscar produtos:',
        err.response?.data || err.message,
      );
      return { produtos: [], hasNext: false };
    }
  }
}

/*
🗓 24/10/2025 - 16:45
✨ Extração da lógica de produtos do core → módulo dedicado.
--------------------------------------------
📘 Lógica:
- Requisições diretas à API Bling (catálogo de produtos).
- Suporte a paginação e logs padronizados.
- Responsável apenas por comunicação HTTP.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
