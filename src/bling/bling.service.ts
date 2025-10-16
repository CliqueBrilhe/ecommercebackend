// src/bling/bling.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BlingService {
  private accessToken?: string;
  private baseUrl = 'https://api.bling.com.br/Api/v3';

  constructor() {
    this.accessToken = process.env.BLING_ACCESS_TOKEN?.trim() || '';
    console.log('Bling access token:', this.accessToken);
    if (!this.accessToken) {
      throw new Error('Bling access token não definido no .env');
    }
  }

  // Buscar produtos
  async getProducts() {
    const url = `${this.baseUrl}/produtos`;

    try {
      const res = await axios.get(url, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      console.log(
        'Resposta da Bling:',
        JSON.stringify(res.data, null, 2),
      );
     const produtosRaw = res.data.data || [];

    // Retorna direto os produtos
    return produtosRaw;
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
  Service 'BlingService':
  - Responsável por se conectar à API da Bling e buscar informações de produtos.
  - O método 'getProducts' realiza uma requisição GET autenticada via Bearer Token
    usando o 'accessToken' definido no .env.
  - A resposta é logada no console e os produtos são retornados diretamente em formato
    de array.
  - Caso haja algum erro na requisição, o erro é logado e retorna um array vazio.

  Date: 15/10/2025
  Edit by: Gabbu (gabriellesote)
*/