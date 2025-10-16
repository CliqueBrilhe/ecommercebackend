// src/bling/sync/services/bling-categorias-sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../../Modules/Category/entities/category.entity';
import { BlingCategoriasService } from '../../core/services/bling-categorias.service';

@Injectable()
export class BlingCategoriasSyncService {
  private readonly logger = new Logger(BlingCategoriasSyncService.name);

  constructor(
    private readonly blingCategoriasService: BlingCategoriasService,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async syncCategories(): Promise<void> {
    this.logger.log('Iniciando sincronização de categorias do Bling...');

    let blingCategories;
    try {
      blingCategories = await this.blingCategoriasService.getAllCategories();
    } catch (error: any) {
      // Log limpo apenas com informações importantes
      this.logger.error(
        `Erro ao buscar categorias do Bling: ${error.response?.status || 'N/A'} - ${JSON.stringify(error.response?.data) || error.message}`
      );
      return; // Sai do sync se der erro
    }

    const categoryMap = new Map<number, Category>();

    for (const blingCategory of blingCategories) {
      let category: Category | undefined;

      category = await this.categoryRepository.findOne({
        where: { blingId: blingCategory.id },
        relations: ['parent'],
      }) || undefined;

      if (!category) {
        category = this.categoryRepository.create();
        category.blingId = blingCategory.id;
      }

      category.name = blingCategory.descricao;
      category.order = blingCategory.ordem || 0;

      if (blingCategory.categoriaPai?.id && blingCategory.categoriaPai.id !== 0) {
        let parent = categoryMap.get(blingCategory.categoriaPai.id);

        if (!parent) {
          parent = await this.categoryRepository.findOne({
            where: { blingId: blingCategory.categoriaPai.id },
          }) || undefined;

          if (!parent) {
            parent = this.categoryRepository.create({
              blingId: blingCategory.categoriaPai.id,
              name: 'Placeholder',
              path: '',
            });
            await this.categoryRepository.save(parent);
          }

          categoryMap.set(parent.blingId!, parent);
        }

        category.parent = parent ?? null;
      } else {
        category.parent = null;
      }

      category.path = category.parent ? `${category.parent.path}/${category.name}` : category.name;

      await this.categoryRepository.save(category);
      categoryMap.set(category.blingId!, category);
    }

    this.logger.log(`Sincronização concluída: ${blingCategories.length} categorias processadas.`);
  }
}

/*
Histórico de alterações:
Edição: 16/10/2025
- Adicionado tratamento de erro limpo para requisição ao Bling
- Correção de tipos nulos no sync de categorias
- Ajuste de parent para aceitar null
--------------------------------------------
Explicação da lógica:
Este service sincroniza categorias do Bling para o banco local.
- Verifica se a categoria já existe via blingId
- Cria placeholders para categorias pai ainda não existentes
- Atualiza nome, ordem e path (materialized)
- Salva no banco
by: gabbu (github: gabriellesote)
*/
