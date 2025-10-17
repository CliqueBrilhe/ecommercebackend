// src/Bling/core/bling.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { blingHttp } from '../../utils/bling-http';

@Injectable()
export class BlingService {
  private readonly logger = new Logger(BlingService.name);

  // Busca genérica para qualquer endpoint da API do Bling
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await blingHttp.get(endpoint, { params });
      console.log('Response from Bling API testeeeeeeeeeeeeeeeeee:', response.data);
      return response.data;
    } catch (err: any) {
      this.logger.error('Erro ao buscar dados no Bling:', err.response?.data || err.message);
      throw err;
    }
  }

  async getProducts() {
    try {
      const { data } = await blingHttp.get('/produtos');
      return data || [];
    } catch (err: any) {
      this.logger.error('Erro ao buscar produtos:', err.response?.data || err.message);
      return [];
    }
  }

  async getCategories() {
    try {
      const { data } = await blingHttp.get('/categorias/produtos');
      return data || [];
    } catch (err: any) {
      this.logger.error('Erro ao buscar categorias:', err.response?.data || err.message);
      return [];
    }
  }
}

/*
🗓 17/10/2025
🔧 Refatoração: BlingService agora usa o `blingHttp` centralizado.
--------------------------------------------
📘 Lógica:
- Usa `blingHttp` configurado para comunicação com a API do Bling.
- Remove duplicação de configuração (baseURL, headers, token).
- Mantém apenas a lógica de requisição de produtos e categorias.
by: gabbu (github: gabriellesote)
*/
