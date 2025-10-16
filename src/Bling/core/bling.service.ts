// src/bling/core/bling.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BlingService {
  private readonly baseUrl = 'https://api.bling.com.br/Api/v3';
  private readonly accessToken: string;

  constructor() {
    this.accessToken = process.env.BLING_ACCESS_TOKEN?.trim() || '';
    if (!this.accessToken) {
      throw new Error('Bling access token não definido no .env');
    }
  }

  // Método genérico para requisições GET à API do Bling
  async get<T = any>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const res = await axios.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
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
