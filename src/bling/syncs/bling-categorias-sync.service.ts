// src/syncs/bling-categorias-sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Categoria } from 'src/categoria/categoria.entity';

@Injectable()
export class BlingCategoriasSyncService {
  private readonly logger = new Logger(BlingCategoriasSyncService.name);
  private readonly baseUrl = 'https://api.bling.com.br/Api/v3';

  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  /**
   * Sincroniza categorias do Bling com o banco local.
   * Cria categorias novas ou atualiza existentes, respeitando a hierarquia pai/filho.
   */
  async sincronizarCategorias(): Promise<void> {
    const token = process.env.BLING_ACCESS_TOKEN?.trim();
    if (!token) {
      this.logger.error('Token de acesso ao Bling não configurado.');
      return;
    }

    this.logger.log('Iniciando sincronização de categorias com o Bling...');

    try {
      const response = await axios.get(`${this.baseUrl}/categorias`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const categorias = response.data?.data;
      if (!Array.isArray(categorias)) {
        this.logger.warn('Nenhuma categoria encontrada no Bling.');
        return;
      }

      // Primeiro criamos ou atualizamos todas as categorias, sem definir o parent
      const categoriaMap = new Map<number, Categoria>();
      for (const item of categorias) {
        const blingId = item.id;
        const nome = item.descricao || 'Sem nome';

        let categoria = await this.categoriaRepository.findOne({
          where: { id: blingId },
        });

        if (!categoria) {
          categoria = this.categoriaRepository.create({
            id: blingId, // Usando o ID do Bling como PK local
            nome,
            path: '', // será atualizado depois
          });
        } else {
          categoria.nome = nome;
        }

        await this.categoriaRepository.save(categoria);
        categoriaMap.set(blingId, categoria);
      }

      // Agora definimos os pais e path
      for (const item of categorias) {
        const categoria = categoriaMap.get(item.id);
        if (!categoria) continue;

        const parentId = item.categoriaPai?.id;
        if (parentId != null && parentId !== 0) {
          const parentCategoria = categoriaMap.get(parentId);
          if (parentCategoria) {
            categoria.parent = parentCategoria ?? null;
            categoria.path = parentCategoria
              ? `${parentCategoria.path}/${categoria.id}`
              : `${categoria.id}`;
          }
        } else {
          categoria.parent = null;
          categoria.path = `${categoria.id}`;
        }

        await this.categoriaRepository.save(categoria);
      }

      this.logger.log('Sincronização de categorias concluída com sucesso.');
    } catch (error) {
      this.logger.error('Erro ao sincronizar categorias:', error.message);
    }
  }
}

/*

✅ O que este código faz:

Busca todas as categorias no Bling.
Cria ou atualiza categorias no banco local.
Mantém o relacionamento pai/filho usando parent e path.
Permite categorias raiz (categoriaPai.id === 0) e subcategorias.
Logging completo de progresso e erros.

*/
