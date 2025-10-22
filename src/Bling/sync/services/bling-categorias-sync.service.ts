// src/Bling/sync/services/bling-categorias-sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../Modules/Category/entities/category.entity';
import { BlingService } from '../../core/services/bling.service';
import { SyncResult } from '../types/sync-result.interface'; // 👈 novo import

@Injectable()
export class BlingCategoriasSyncService {
  private readonly logger = new Logger(BlingCategoriasSyncService.name);

  constructor(
    private readonly blingService: BlingService,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async sincronizarCategorias(): Promise<SyncResult> {
    this.logger.log('🔄 Iniciando sincronização de categorias com o Bling...');

    const response = await this.blingService.getCategories();
    const categoriasBling = response?.data;
    if (!Array.isArray(categoriasBling) || categoriasBling.length === 0) {
      this.logger.warn('⚠️ Nenhuma categoria encontrada na API do Bling.');
      return { createdCount: 0, updatedCount: 0 };
    }

    let criadas = 0;
    let atualizadas = 0;
    let vinculadas = 0;

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
      } else {
        categoriaExistente = this.categoryRepository.create(dadosCategoria);
        await this.categoryRepository.save(categoriaExistente);
        criadas++;
      }
    }

    for (const categoria of categoriasBling) {
      if (!categoria.categoriaPai?.id) continue;

      const categoriaFilho = await this.categoryRepository.findOne({ where: { blingId: categoria.id } });
      const categoriaPai = await this.categoryRepository.findOne({ where: { blingId: categoria.categoriaPai.id } });

      if (categoriaFilho && categoriaPai) {
        categoriaFilho.parent = categoriaPai;
        await this.categoryRepository.save(categoriaFilho);
        vinculadas++;
      }
    }

    this.logger.log('✅ Sincronização de categorias concluída!');
    this.logger.log(`📊 Resumo: ${criadas} criadas | ${atualizadas} atualizadas | ${vinculadas} vinculadas como filhas.`);

    return { createdCount: criadas, updatedCount: atualizadas };
  }
}

/*
🗓 22/10/2025 - 14:45
Refatoração: sincronizarCategorias() agora retorna SyncResult com contagens.
--------------------------------------------
Lógica: retorna quantas categorias foram criadas/atualizadas,
permitindo que o scheduler exiba métricas detalhadas.
edit by: gabbu (gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
