// src/Bling/catalogo/produtos/produto-sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../Modules/Product/entities/product.entity';
import { Category } from '../../../Modules/Category/entities/category.entity';
import { ProdutoService } from './produto.service';
import { SyncResult } from '../../core/types/sync-result.interface';
import { styledLog } from '../../../utils/log-style.util';

@Injectable()
export class ProdutoSyncService {
  private readonly logger = new Logger(ProdutoSyncService.name);

  constructor(
    private readonly produtoService: ProdutoService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Busca todas as páginas de produtos da API do Bling.
   */
  async fetchAllProducts(): Promise<any[]> {
    let page = 1;
    let all: any[] = [];
    let hasNext = true;

    while (hasNext) {
      const { produtos, hasNext: next } = await this.produtoService.getProducts(page);
      all = [...all, ...produtos];
      hasNext = next;
      page++;
      if (hasNext) await new Promise((r) => setTimeout(r, 300));
    }

    styledLog('products', `📦 Total de produtos obtidos: ${all.length}`, 'cyan');
    return all;
  }

  /**
   * Sincroniza todos os produtos entre o Bling e o banco local.
   */
  async sincronizarProdutos(): Promise<SyncResult> {
    styledLog('products', '🔄 Iniciando sincronização completa de produtos...', 'cyan');

    const produtosBling = await this.fetchAllProducts();
    if (!Array.isArray(produtosBling) || produtosBling.length === 0) {
      styledLog('warning', '⚠️ Nenhum produto encontrado na API do Bling.', 'brightYellow');
      return { createdCount: 0, updatedCount: 0 };
    }

    const produtosLocais = await this.productRepository.find();

    let criados = 0, atualizados = 0, marcados = 0, reativados = 0, inativados = 0, removidos = 0;

    for (const produto of produtosBling) {
      const { result, status } = await this.upsertFromWebhook(produto);
      if (result === 'created') criados++;
      else if (result === 'updated') atualizados++;
      if (status === 'inactive') inativados++;
      else if (status === 'active') reativados++;
    }

    // 🔍 Verifica produtos locais não encontrados no Bling
    for (const produtoLocal of produtosLocais) {
      const produtoBling = produtosBling.find(
        (p) => Number(p.id) === Number(produtoLocal.blingId),
      );

      if (!produtoBling) {
        if (produtoLocal.status === 'to_verify') {
          await this.productRepository.delete({ id: produtoLocal.id });
          removidos++;
          styledLog('products', `🗑️ Produto removido: ${produtoLocal.name}`, 'red');
        } else {
          await this.productRepository.update(
            { id: produtoLocal.id },
            { status: 'to_verify' },
          );
          marcados++;
          styledLog('products', `🚨 Produto marcado como "to_verify": ${produtoLocal.name}`, 'brightYellow');
        }
        continue;
      }
    }

    styledLog(
      'products',
      `✅ Sync concluída: ${criados} criados | ${atualizados} atualizados | ${inativados} inativados | ${marcados} marcados | ${reativados} reativados | ${removidos} removidos.`,
      'brightGreen',
    );

    return { createdCount: criados, updatedCount: atualizados };
  }

  /**
   * Cria ou atualiza um produto individual (usado pela sync e webhooks).
   */
  async upsertFromWebhook(data: any) {
    const {
      id, nome, codigo, preco, descricaoCurta,
      imagemURL, estoque, categoria, situacao,
    } = data;

    const normalizedStatus: 'active' | 'inactive' | 'to_verify' =
      situacao === 'I' || situacao === 'E' ? 'inactive' : 'active';

    const stockQuantity =
      typeof estoque === 'object' ? (estoque.saldoVirtualTotal ?? 0) : 0;

    let categoriaLocal: Category | null = null;
    if (categoria?.id) {
      categoriaLocal = await this.categoryRepository.findOne({
        where: { blingId: Number(categoria.id) },
      });
    }

    const base = {
      blingId: Number(id),
      code: codigo || `CODE_${id}`,
      name: nome,
      price: preco || 0,
      stockQuantity,
      description: descricaoCurta || null,
      images: imagemURL ? [imagemURL] : [],
      synchronized: true,
      status: normalizedStatus,
      category: categoriaLocal ?? undefined,
    };

    const existente = await this.productRepository.findOne({
      where: { blingId: Number(id) },
      relations: ['category'],
    });

    if (existente) {
      Object.assign(existente, base);
      await this.productRepository.save(existente);
      styledLog('products', `♻️ Atualizado: ${nome} (${normalizedStatus})`, 'green');
      return { result: 'updated', linkedCategory: !!categoriaLocal, status: normalizedStatus };
    }

    const novo = this.productRepository.create(base);
    await this.productRepository.save(novo);
    styledLog('products', `🆕 Criado: ${nome} (${normalizedStatus})`, 'brightGreen');
    return { result: 'created', linkedCategory: !!categoriaLocal, status: normalizedStatus };
  }

  async removeByBlingId(blingId: number) {
    await this.productRepository.delete({ blingId });
    styledLog('products', `🗑️ Produto removido via webhook (BlingID: ${blingId})`, 'red');
  }
}

/*
🗓 24/10/2025 - 17:00
♻️ Modularização completa: BlingProdutosSyncService → ProdutoSyncService.
--------------------------------------------
📘 Lógica:
- Mantém ciclo de sincronização completo (create/update/remove).
- Usa ProdutoService para comunicação API.
- Mantém logs coloridos padronizados.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
