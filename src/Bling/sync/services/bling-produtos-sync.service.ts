// src/Bling/sync/services/bling-produtos-sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../Modules/Product/entities/product.entity';
import { Category } from '../../../Modules/Category/entities/category.entity';
import { BlingService } from '../../core/services/bling.service';

@Injectable()
export class BlingProdutosSyncService {
  private readonly logger = new Logger(BlingProdutosSyncService.name);

  constructor(
    private readonly blingService: BlingService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Sincroniza produtos do Bling com o banco local.
   * - Cria novos produtos.
   * - Atualiza produtos existentes (por blingId).
   * - Relaciona com a categoria local (por blingId).
   */
  async sincronizarProdutos(): Promise<void> {
    this.logger.log('🔄 Iniciando sincronização de produtos com o Bling...');

    // 1️⃣ Buscar produtos da API do Bling
    const response = await this.blingService.getProducts();
    const produtosBling = response?.data;

    if (!Array.isArray(produtosBling) || produtosBling.length === 0) {
      this.logger.warn('⚠️ Nenhum produto encontrado na API do Bling.');
      return;
    }

    let criados = 0;
    let atualizados = 0;
    let vinculados = 0;

    // 2️⃣ Percorrer e salvar produtos
    for (const produto of produtosBling) {
      const {
        id,
        nome,
        codigo,
        preco,
        descricaoCurta,
        imagemURL,
        estoque,
        categoria,
      } = produto;

      // Quantidade total em estoque (o saldoVirtualTotal é um array, mas pode vir vazio)
      const stockQuantity = estoque?.saldoVirtualTotal?.[0]?.saldo || 0;

      // Busca a categoria local, se houver vínculo
      let categoriaLocal: Category | null = null;
      if (categoria?.id) {
        categoriaLocal = await this.categoryRepository.findOne({
          where: { blingId: categoria.id },
        });

        if (categoriaLocal) vinculados++;
      }

      // Dados base do produto
      const dadosProduto = {
        blingId: id,
        code: codigo || `CODE_${id}`,
        name: nome,
        price: preco || 0,
        stockQuantity,
        stock: stockQuantity,
        description: descricaoCurta || null,
        images: imagemURL ? [imagemURL] : [],
        category: categoriaLocal,
        synchronized: true,
      };

      // Verifica se já existe produto com mesmo blingId
      const produtoExistente = await this.productRepository.findOne({
        where: { blingId: id },
      });

      if (produtoExistente) {
        const { category, ...dadosSemCategoria } = dadosProduto;

        await this.productRepository.update(
          produtoExistente.id,
          dadosSemCategoria,
        );
        atualizados++;
      } else {
        const dadosProdutoLimpo = {
          ...dadosProduto,
          category: dadosProduto.category ?? undefined,
        };

        const novoProduto = this.productRepository.create(dadosProdutoLimpo);
        await this.productRepository.save(novoProduto);
        await this.productRepository.save(novoProduto);
        criados++;
      }
    }

    // 3️⃣ Logs finais
    this.logger.log('✅ Sincronização de produtos concluída!');
    this.logger.log(
      `📊 Resumo: ${criados} criados | ${atualizados} atualizados | ${vinculados} vinculados a categorias.`,
    );
  }
}

/*
🕓 17/10/2025 - criação do serviço manual de sincronização de produtos
--------------------------------------------
Lógica: consulta produtos da API do Bling, cria ou atualiza localmente com base no blingId,
relaciona cada produto à categoria correspondente e gera logs detalhados de execução.
by: gabbu (github: gabriellesote)
*/
