// src/Bling/core/bling.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { blingCatalogHttp, blingSalesHttp } from '../../utils/bling-http';

@Injectable()
export class BlingService {
  private readonly logger = new Logger(BlingService.name);

  /**
   * Busca produtos do Bling com suporte a paginação.
   * Retorna os produtos da página atual + se há próxima página.
   */
  async getProducts(page = 1) {
    try {
      const response = await blingCatalogHttp.get('/produtos', {
        params: { pagina: page, criterio: 5 }, // conforme doc oficial
        headers: { Accept: 'application/json' },
      });

      // Estrutura real da API: { data: [...], page, hasNext }
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

  async getCategories() {
    try {
      const response = await blingCatalogHttp.get('/categorias/produtos');
      const payload = response.data;
      return payload?.data ?? [];
    } catch (err: any) {
      this.logger.error(
        'Erro ao buscar categorias:',
        err.response?.data || err.message,
      );
      return [];
    }
  }

  // ⚬──────────✧──────────⚬
  // Usuarios ou contatos (como é referido na api da bling)

  async getUsers(page = 1) {
    try {
      const response = await blingSalesHttp.get('/contatos', {
        params: { pagina: page, criterio: 1 }, // conforme doc oficial
        headers: { Accept: 'application/json' },
      });

      // Estrutura real da API: { data: [...], page, hasNext }
      const usuarios = response.data?.data ?? [];
      const hasNext = response.data?.hasNext ?? false;

      this.logger.log(
        `📦 Página ${page} carregada (${usuarios.length} usuários) | hasNext=${hasNext}`,
      );

      return { usuarios, hasNext };
    } catch (err: any) {
      this.logger.error(
        '❌ Erro ao buscar Usuários:',
        err.response?.data || err.message,
      );
      return { usuarios: [], hasNext: false };
    }
  }
}
