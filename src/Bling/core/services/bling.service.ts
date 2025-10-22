// src/Bling/core/bling.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { blingHttp } from '../../utils/bling-http';

@Injectable()
export class BlingService {
  private readonly logger = new Logger(BlingService.name);

  /**
   * Busca produtos do Bling com suporte a paginação.
   * Retorna os produtos da página atual + se há próxima página.
   */
async getProducts(page = 1) {
  try {
    const response = await blingHttp.get('/produtos', {
      params: { pagina: page },
    });

    // A API retorna { produtos: [...], hasNext: boolean }
    const produtos = response.data?.produtos ?? [];
    const hasNext = response.data?.hasNext ?? false;

    this.logger.log(
      `📦 Página ${page} carregada (${produtos.length} produtos) | hasNext=${hasNext}`,
    );

    return { produtos, hasNext };
  } catch (err: any) {
    this.logger.error('Erro ao buscar produtos:', err.response?.data || err.message);
    return { produtos: [], hasNext: false };
  }
}


  async getCategories() {
    try {
      const response = await blingHttp.get('/categorias/produtos');
      const payload = response.data;
      return payload?.data ?? [];
    } catch (err: any) {
      this.logger.error('Erro ao buscar categorias:', err.response?.data || err.message);
      return [];
    }
  }
}
