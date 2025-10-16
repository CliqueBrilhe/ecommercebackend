// src/bling/core/services/bling-categorias.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BlingCategoriasService {
  private readonly logger = new Logger(BlingCategoriasService.name);

  // Substitua pelo seu token real do Bling ou use variáveis de ambiente
  private readonly API_URL = 'https://api.bling.com.br/Api/v3/categorias/produtos';
  private readonly API_TOKEN = process.env.BLING_ACCESS_TOKEN || 'YOUR_BLING_TOKEN';

  async getAllCategories(page = 1, limit = 100): Promise<any[]> {
    const categories: any[] = [];

    let currentPage = page;
    let totalPages = 1;

    try {
      while (currentPage <= totalPages) {
        this.logger.log(`Buscando categorias do Bling - página ${currentPage}`);

        const response = await axios.get(`${this.API_URL}?pagina=${currentPage}&limite=${limit}`, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${this.API_TOKEN}`,
          },
          maxBodyLength: Infinity,
        });

        const data = response.data?.retorno?.categorias?.map((c) => c.categoria) || [];

        categories.push(...data);

        // Bling não retorna total de páginas, então você pode parar se não vier mais categorias
        if (data.length < limit) break;

        currentPage++;
      }

      this.logger.log(`Total de categorias retornadas: ${categories.length}`);
      return categories;
    } catch (error) {
      this.logger.error('Erro ao buscar categorias do Bling', error);
      return [];
    }
  }
}

/*
Histórico de alterações:
Edição: 16/10/2025
- Criação do BlingCategoriasService
- Lógica de chamada paginada à API do Bling usando axios
- Retorna array de categorias pronto para o sync
--------------------------------------------
Explicação da lógica:
Este service encapsula a chamada HTTP para a API de categorias do Bling.
- Pagina os resultados automaticamente
- Retorna apenas os dados das categorias
- Pode ser reutilizado por sync ou controllers de teste
by: gabbu (github: gabriellesote)
*/
