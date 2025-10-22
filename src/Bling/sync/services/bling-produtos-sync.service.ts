import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from '../../../Modules/Product/entities/product.entity';
import { Category } from '../../../Modules/Category/entities/category.entity';
import { BlingService } from '../../core/services/bling.service';
import { SyncResult } from '../types/sync-result.interface';
import { styledLog } from '../../../utils/log-style.util';

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
   * Busca todas as páginas de produtos da API do Bling.
   * Garante que nenhum produto seja ignorado, mesmo em grandes volumes.
   */
  async fetchAllProducts(): Promise<any[]> {
    let page = 1;
    let all: any[] = [];
    let hasNext = true;

    while (hasNext) {
      const { produtos, hasNext: next } = await this.blingService.getProducts(page);
      all = [...all, ...produtos];
      hasNext = next;
      page++;

      // 🕒 Pausa de 300ms entre as páginas para evitar erro 429 (rate limit)
      if (hasNext) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    styledLog('products', `📦 Total de produtos obtidos: ${all.length}`, 'cyan');
    return all;
  }

  /**
   * Sincroniza todos os produtos entre o Bling e o banco local.
   * Cria, atualiza e marca produtos ausentes com status "to_verify".
   */
  async sincronizarProdutos(): Promise<SyncResult> {
    styledLog('products', '🔄 Iniciando sincronização completa de produtos...', 'cyan');

    // 🔹 Busca todas as páginas da API
    const produtosBling = await this.fetchAllProducts();

    if (!Array.isArray(produtosBling) || produtosBling.length === 0) {
      styledLog('warning', '⚠️ Nenhum produto encontrado na API do Bling.', 'brightYellow');
      return { createdCount: 0, updatedCount: 0 };
    }

    const produtosLocais = await this.productRepository.find();
    const idsBling = produtosBling.map((p) => p.id);

    let criados = 0, atualizados = 0, marcados = 0;

    // 🧩 Atualiza ou cria produtos
    for (const produto of produtosBling) {
      const { result } = await this.upsertFromWebhook(produto);
      if (result === 'created') criados++;
      else if (result === 'updated') atualizados++;
    }

    // 🗑️ Marca produtos locais que não existem mais no Bling
    const produtosParaVerificar = produtosLocais.filter(
      (p) => !idsBling.includes(p.blingId),
    );

    if (produtosParaVerificar.length > 0) {
      const idsRemovidos = produtosParaVerificar.map((p) => p.blingId);
      await this.productRepository.update({ blingId: In(idsRemovidos) }, { status: 'to_verify' });
      marcados = idsRemovidos.length;
      styledLog(
        'products',
        `🚨 ${marcados} produtos marcados como "to_verify" (ausentes na API Bling).`,
        'brightYellow',
      );
    }

    styledLog(
      'products',
      `✅ Sincronização concluída: ${criados} criados | ${atualizados} atualizados | ${marcados} marcados.`,
      'brightGreen',
    );

    return { createdCount: criados, updatedCount: atualizados };
  }

  /**
   * Cria ou atualiza um produto individual (usado pela sync e webhooks).
   */
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
      categoriaLocal = await this.categoryRepository.findOne({
        where: { blingId: categoria.id },
      });
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
      status: situacao,
      category: categoriaLocal ?? undefined,
    };

    const existente = await this.productRepository.findOne({
      where: { blingId: id },
      relations: ['category'],
    });

    if (existente) {
      Object.assign(existente, base);
      await this.productRepository.save(existente);
      styledLog('products', `♻️ Produto atualizado: ${nome} (BlingID: ${id})`, 'green');
      return { result: 'updated', linkedCategory: !!categoriaLocal };
    }

    const novo = this.productRepository.create(base);
    await this.productRepository.save(novo);
    styledLog('products', `🆕 Produto criado: ${nome} (BlingID: ${id})`, 'brightGreen');
    return { result: 'created', linkedCategory: !!categoriaLocal };
  }

  /**
   * Remoção direta (usado pelo webhook de exclusão).
   */
  async removeByBlingId(blingId: number) {
    await this.productRepository.delete({ blingId });
    styledLog('products', `🗑️ Produto removido via webhook (BlingID: ${blingId})`, 'red');
  }
}

/*
🗓 22/10/2025 - 21:10
🔧 Correção final: paginação completa + delay entre páginas + marcação segura "to_verify".
--------------------------------------------
📘 Lógica:
- Busca todas as páginas até `totalPages` da API Bling.
- Cria e atualiza produtos localmente.
- Marca produtos não encontrados como "to_verify" em vez de deletar.
- Adiciona pausa entre requests para evitar erro 429.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
