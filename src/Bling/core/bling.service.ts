// src/bling/core/bling.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BlingService {
  private readonly logger = new Logger(BlingService.name);
  private readonly baseUrl = 'https://api.bling.com.br/Api/v3';
  private readonly accessToken: string;

  constructor() {
    const access = process.env.BLING_ACCESS_TOKEN?.trim();
    const refresh = process.env.BLING_REFRESH_TOKEN?.trim();

    if (access) {
      this.accessToken = access;
      this.logger.log('Usando BLING_ACCESS_TOKEN');
    } else if (refresh) {
      this.accessToken = refresh;
      this.logger.warn(
        'BLING_ACCESS_TOKEN ausente ou expirado. Usando BLING_REFRESH_TOKEN como fallback',
      );
    } else {
      throw new Error(
        'Nenhum token Bling definido no .env. Configure BLING_ACCESS_TOKEN ou BLING_REFRESH_TOKEN',
      );
    }
  }

  // Método genérico para requisições GET à API do Bling
  async get<T = any>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const res = await axios.get(url, {
      params: {
        apikey: this.accessToken, // ✅ Bling espera o token aqui
      },
      headers: {
        Accept: 'application/json',
      },
    });
    return res.data;
  }

  // Método para buscar todos os produtos da Bling
  async getProducts() {
    try {
      const data = await this.get('/produtos');
      return data.data || [];
    } catch (err: any) {
      console.error(
        'Erro ao buscar produtos da Bling:',
        err.response?.data || err.message,
      );
      return [];
    }
  }
}

/*
🗓 16/10/2025
🔧 Refatoração: padronização de estrutura e nomenclatura para o novo módulo `core/` da integração com a Bling.
--------------------------------------------
📘 Lógica: 
Serviço responsável por se comunicar diretamente com a API da Bling. 
Inclui método genérico `get()` para requisições GET e `getProducts()` para buscar produtos.
Utiliza `axios` e autenticação via token definido em `.env`.
by: gabbu (github: gabriellesote)
*/
