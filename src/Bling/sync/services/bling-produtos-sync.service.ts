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

  // 🔁 Usado pelo CRON (sync completa) e pode ser chamado manualmente
  async sincronizarProdutos(): Promise<void> {
    this.logger.log('🔄 Iniciando sincronização de produtos com o Bling...');
    const response = await this.blingService.getProducts();
    const produtosBling = response?.data;

    if (!Array.isArray(produtosBling) || produtosBling.length === 0) {
      this.logger.warn('⚠️ Nenhum produto encontrado na API do Bling.');
      return;
    }

    let criados = 0;
    let atualizados = 0;
    let vinculados = 0;

    for (const produto of produtosBling) {
      const { result, linkedCategory } = await this.upsertFromWebhook(produto);
      if (result === 'created') criados++;
      if (result === 'updated') atualizados++;
      if (linkedCategory) vinculados++;
    }

    this.logger.log('✅ Sincronização de produtos concluída!');
    this.logger.log(`📊 Resumo: ${criados} criados | ${atualizados} atualizados | ${vinculados} vinculados a categorias.`);
  }

  // 🧩 Usado diretamente pelo webhook (product.created / product.updated)
  async upsertFromWebhook(data: any): Promise<{ result: 'created' | 'updated'; linkedCategory: boolean }> {
    const {
      id,
      nome,
      codigo,
      preco,
      descricaoCurta,
      imagemURL,
      estoque,
      categoria,
      situacao,
    } = data;

    const stockQuantity = estoque?.saldoVirtualTotal?.[0]?.saldo ?? 0;

    let categoriaLocal: Category | null = null;
    if (categoria?.id) {
      categoriaLocal = await this.categoryRepository.findOne({ where: { blingId: categoria.id } });
    }

    const base = {
      blingId: id,
      code: codigo || `CODE_${id}`,
      name: nome,
      price: preco || 0,
      stockQuantity,
      stock: stockQuantity,
      description: descricaoCurta || null,
      images: imagemURL ? [imagemURL] : [],
      synchronized: true,
      status: situacao, // se existir esse campo na sua entidade
    };

    const existente = await this.productRepository.findOne({ where: { blingId: id }, relations: ['category'] });

    if (existente) {
      Object.assign(existente, base);
      existente.category = categoriaLocal ?? existente.category ?? undefined;
      await this.productRepository.save(existente);
      this.logger.log(`♻️ Produto atualizado: ${nome} (BlingID: ${id})`);
      return { result: 'updated', linkedCategory: !!categoriaLocal };
    }

    const novo = this.productRepository.create({ ...base, category: categoriaLocal ?? undefined });
    await this.productRepository.save(novo);
    this.logger.log(`🆕 Produto criado: ${nome} (BlingID: ${id})`);
    return { result: 'created', linkedCategory: !!categoriaLocal };
  }

  // 🗑️ Usado por product.deleted
  async removeByBlingId(blingId: number) {
    await this.productRepository.delete({ blingId });
    this.logger.warn(`🗑️ Produto removido (BlingID: ${blingId})`);
  }
}

/*
🗓 21/10/2025 - 11:25
🔧 Edição: adicionados métodos upsertFromWebhook() e removeByBlingId(); removido save duplicado; serviço preparado para ser chamado por webhook e CRON.
--------------------------------------------
📘 Lógica:
- sincronizarProdutos(): faz uma varredura completa na API do Bling e upserta localmente.
- upsertFromWebhook(data): insere/atualiza um único produto vindo do evento do webhook.
- removeByBlingId(): remove o produto local quando o Bling notificar exclusão.
edit by: gabbu (gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
