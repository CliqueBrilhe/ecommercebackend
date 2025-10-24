// src/Bling/catalogo/categorias/categoria-sync.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../Modules/Category/entities/category.entity';
import { CategoriaService } from './categoria.service';
import { SyncResult } from '../../core/types/sync-result.interface';
import { styledLog } from '../../../utils/log-style.util';

@Injectable()
export class CategoriaSyncService {
  constructor(
    private readonly categoriaService: CategoriaService,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * 🔄 Sincroniza categorias do Bling com o banco local.
   * Cria, atualiza e vincula hierarquias pai/filho.
   */
  async sincronizarCategorias(): Promise<SyncResult> {
    styledLog('categories', '🔄 Iniciando sincronização de categorias...', 'cyan');

    try {
      const categoriasBling = await this.categoriaService.getCategories();
      if (!Array.isArray(categoriasBling) || categoriasBling.length === 0) {
        styledLog('warning', '⚠️ Nenhuma categoria encontrada na API do Bling.', 'brightYellow');
        return { createdCount: 0, updatedCount: 0 };
      }

      let criadas = 0, atualizadas = 0, vinculadas = 0;

      // 🔹 Criação ou atualização das categorias
      for (const categoria of categoriasBling) {
        const { id, descricao } = categoria;
        const blingId = Number(id);

        let categoriaExistente = await this.categoryRepository.findOne({
          where: { blingId },
          relations: ['parent'],
        });

        const dadosCategoria = {
          name: descricao,
          path: descricao.toLowerCase().replace(/\s+/g, '-'),
          blingId,
        };

        if (categoriaExistente) {
          await this.categoryRepository.update(categoriaExistente.id, dadosCategoria);
          atualizadas++;
          styledLog('categories', `♻️ Categoria atualizada: ${descricao} (BlingID: ${blingId})`, 'green');
        } else {
          categoriaExistente = this.categoryRepository.create(dadosCategoria);
          await this.categoryRepository.save(categoriaExistente);
          criadas++;
          styledLog('categories', `🆕 Categoria criada: ${descricao} (BlingID: ${blingId})`, 'brightGreen');
        }
      }

      // 🔹 Vinculação pai/filho
      for (const categoria of categoriasBling) {
        if (!categoria.categoriaPai?.id) continue;

        const categoriaFilho = await this.categoryRepository.findOne({
          where: { blingId: Number(categoria.id) },
        });
        const categoriaPai = await this.categoryRepository.findOne({
          where: { blingId: Number(categoria.categoriaPai.id) },
        });

        if (categoriaFilho && categoriaPai) {
          categoriaFilho.parent = categoriaPai;
          await this.categoryRepository.save(categoriaFilho);
          vinculadas++;
          styledLog(
            'categories',
            `🔗 Vinculada subcategoria "${categoriaFilho.name}" → "${categoriaPai.name}"`,
            'brightCyan',
          );
        }
      }

      styledLog(
        'categories',
        `✅ Sincronização concluída: ${criadas} criadas | ${atualizadas} atualizadas | ${vinculadas} vinculadas.`,
        'brightGreen',
      );

      return { createdCount: criadas, updatedCount: atualizadas };
    } catch (error: any) {
      styledLog(
        'categories',
        `❌ Erro durante sincronização de categorias: ${error?.message || error}`,
        'brightRed',
      );
      return { createdCount: 0, updatedCount: 0 };
    }
  }

  /**
   * ♻️ Cria ou atualiza uma categoria (usado por webhooks).
   */
  async upsertFromWebhook(data: any) {
    styledLog('categories', `📩 Atualização recebida via webhook`, 'cyan');
    return this.sincronizarCategorias();
  }

  /**
   * 🗑️ Remove categoria pelo BlingID (usado por webhooks).
   */
  async removeByBlingId(blingId: number) {
    const categoria = await this.categoryRepository.findOne({ where: { blingId } });
    if (categoria) {
      await this.categoryRepository.remove(categoria);
      styledLog('categories', `🗑️ Categoria removida via webhook (BlingID=${blingId})`, 'red');
    }
  }
}

/*
🗓 24/10/2025 - 23:00
♻️ Melhoria: suporte a eventos do webhook + logs aprimorados.
--------------------------------------------
📘 Lógica:
- Faz sincronização total ou parcial (via webhook).
- Cria/atualiza categorias e vincula pai/filho.
- Suporta remoção individual.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
