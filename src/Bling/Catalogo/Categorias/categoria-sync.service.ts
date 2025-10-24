// src/Bling/catalogo/categorias/categoria-sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../Modules/Category/entities/category.entity';
import { CategoriaService } from './categoria.service';
import { SyncResult } from '../../Core/types/sync-result.interface';
import { styledLog } from '../../../utils/log-style.util';

@Injectable()
export class CategoriaSyncService {
  private readonly logger = new Logger(CategoriaSyncService.name);

  constructor(
    private readonly categoriaService: CategoriaService,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Sincroniza categorias do Bling com o banco local.
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

        let categoriaExistente = await this.categoryRepository.findOne({
          where: { blingId: id },
          relations: ['parent'],
        });

        const dadosCategoria = {
          name: descricao,
          path: descricao.toLowerCase().replace(/\s+/g, '-'),
          blingId: id,
        };

        if (categoriaExistente) {
          await this.categoryRepository.update(categoriaExistente.id, dadosCategoria);
          atualizadas++;
          styledLog('categories', `♻️ Categoria atualizada: ${descricao} (BlingID: ${id})`, 'green');
        } else {
          categoriaExistente = this.categoryRepository.create(dadosCategoria);
          await this.categoryRepository.save(categoriaExistente);
          criadas++;
          styledLog('categories', `🆕 Categoria criada: ${descricao} (BlingID: ${id})`, 'brightGreen');
        }
      }

      // 🔹 Vinculação pai/filho
      for (const categoria of categoriasBling) {
        if (!categoria.categoriaPai?.id) continue;

        const categoriaFilho = await this.categoryRepository.findOne({
          where: { blingId: categoria.id },
        });
        const categoriaPai = await this.categoryRepository.findOne({
          where: { blingId: categoria.categoriaPai.id },
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
}

/*
🗓 24/10/2025 - 18:25
♻️ Modularização: BlingCategoriasSyncService → CategoriaSyncService.
--------------------------------------------
📘 Lógica:
- Sincroniza categorias Bling → banco local.
- Cria, atualiza e vincula hierarquias pai/filho.
- Usa CategoriaService para comunicação com API.
- Logs padronizados com styledLog().
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
