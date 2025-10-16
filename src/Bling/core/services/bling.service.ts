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
    if (!access) {
      throw new Error('Nenhum token Bling definido no .env. Configure BLING_ACCESS_TOKEN');
    }
    this.accessToken = access;
    this.logger.log('Usando BLING_ACCESS_TOKEN');
  }

  // Método genérico para requisições GET à API do Bling
   async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        params,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.accessToken}`, // segue a doc
        },
      });
      return response.data;
    } catch (err: any) {
      this.logger.error('Erro ao buscar dados da Bling:', err.response?.data || err.message);
      throw err;
    }
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
