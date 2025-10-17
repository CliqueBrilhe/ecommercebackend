// src/Bling/sync/services/bling-categorias-sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../Modules/Category/entities/category.entity';
import { BlingService } from '../../core/services/bling.service';

@Injectable()
export class BlingCategoriasSyncService {
  private readonly logger = new Logger(BlingCategoriasSyncService.name);

  constructor(
    private readonly blingService: BlingService,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Sincroniza categorias do Bling com o banco local.
   * - Cria novas categorias.
   * - Atualiza existentes (por blingId).
   * - Mantém hierarquia pai/filho.
   */
  async sincronizarCategorias(): Promise<void> {
    this.logger.log('🔄 Iniciando sincronização de categorias com o Bling...');

    // 1️⃣ Buscar categorias da API do Bling
    const response = await this.blingService.getCategories();
    const categoriasBling = response?.data;
    if (!Array.isArray(categoriasBling) || categoriasBling.length === 0) {
      this.logger.warn('⚠️ Nenhuma categoria encontrada na API do Bling.');
      return;
    }

    // Contadores para relatório final
    let criadas = 0;
    let atualizadas = 0;
    let vinculadas = 0;

    // 2️⃣ Criar/atualizar categorias SEM pai (primeiro)
    for (const categoria of categoriasBling) {
      const { id, descricao, categoriaPai } = categoria;

      let categoriaExistente = await this.categoryRepository.findOne({
        where: { blingId: id },
        relations: ['parent'],
      });

      // Dados base para inserção ou atualização
      const dadosCategoria = {
        name: descricao,
        path: descricao.toLowerCase().replace(/\s+/g, '-'),
        blingId: id,
      };

      if (categoriaExistente) {
        await this.categoryRepository.update(
          categoriaExistente.id,
          dadosCategoria,
        );
         atualizadas++;
      } else {
        categoriaExistente = this.categoryRepository.create(dadosCategoria);
        await this.categoryRepository.save(categoriaExistente);
        criadas++;
      }
    }

    // 3️⃣ Atualizar relacionamento pai-filho
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
      }
    }

    // 4️⃣ Logs de resumo final
    this.logger.log('✅ Sincronização de categorias concluída!');
    this.logger.log(
      `📊 Resumo: ${criadas} criadas | ${atualizadas} atualizadas | ${vinculadas} vinculadas como filhas.`,
    );
  }
}

/*
🕓 17/10/2025 - criação do serviço manual de sincronização de categorias
--------------------------------------------
Lógica: consulta categorias do Bling via BlingService, cria ou atualiza
categorias locais (por blingId) e reconstrói a hierarquia pai-filho.
by: gabbu (github: gabriellesote)
*/
