// src/Bling/sync/services/bling-produtos-sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../Modules/Product/entities/product.entity';
import { Category } from '../../../Modules/Category/entities/category.entity';
import { BlingService } from '../../core/services/bling.service';
import { SyncResult } from '../types/sync-result.interface';
import { styledLog, colors } from '../../../utils/log-style.util';

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
   */
  async fetchAllProducts(): Promise<any[]> {
    let page = 1;
    let all: any[] = [];
    let hasNext = true;

    while (hasNext) {
      const { produtos, hasNext: next } =
        await this.blingService.getProducts(page);
      all = [...all, ...produtos];
      hasNext = next;
      page++;
      if (hasNext) await new Promise((r) => setTimeout(r, 300));
    }

    styledLog(
      'products',
      `📦 Total de produtos obtidos: ${all.length}`,
      'cyan',
    );
    return all;
  }

  /**
   * Sincroniza todos os produtos entre o Bling e o banco local.
   */

  async sincronizarProdutos(): Promise<SyncResult> {
    styledLog(
      'products',
      '🔄 Iniciando sincronização completa de produtos...',
      'cyan',
    );

    const produtosBling = await this.fetchAllProducts();
    if (!Array.isArray(produtosBling) || produtosBling.length === 0) {
      styledLog(
        'warning',
        '⚠️ Nenhum produto encontrado na API do Bling.',
        'brightYellow',
      );
      return { createdCount: 0, updatedCount: 0 };
    }

    const idsBling = produtosBling.map((p) => Number(p.id));
    const produtosLocais = await this.productRepository.find();

    let criados = 0,
      atualizados = 0,
      marcados = 0,
      reativados = 0,
      inativados = 0,
      removidos = 0;

    // 🧩 Criação/atualização de todos os produtos listados no Bling
    for (const produto of produtosBling) {
      const { result, status } = await this.upsertFromWebhook(produto);

      if (result === 'created') criados++;
      else if (result === 'updated') atualizados++;

      if (status === 'inactive') inativados++;
      else if (status === 'active') reativados++;
    }

    // 🧩 Verificação de produtos locais que não vieram da API
    for (const produtoLocal of produtosLocais) {
      const blingIdNum = Number(produtoLocal.blingId);
      const produtoBling = produtosBling.find(
        (p) => Number(p.id) === blingIdNum,
      );

      const situacaoBling = produtoBling?.situacao ?? null;
      const existeNoBling = !!produtoBling;

      // 1️⃣ Produto não existe mais na API → marca ou exclui
      if (!existeNoBling) {
        if (produtoLocal.status === 'to_verify') {
          await this.productRepository.delete({ id: produtoLocal.id });
          removidos++;
          styledLog(
            'products',
            `🗑️ Produto removido: ${produtoLocal.name}`,
            'red',
          );
        } else {
          await this.productRepository.update(
            { id: produtoLocal.id },
            { status: 'to_verify' },
          );
          marcados++;
          styledLog(
            'products',
            `🚨 Produto marcado como "to_verify": ${produtoLocal.name}`,
            'brightYellow',
          );
        }
        continue;
      }

      // 2️⃣ Produto está "E" (excluído)
      if (situacaoBling === 'E') {
        if (produtoLocal.status === 'to_verify') {
          await this.productRepository.delete({ id: produtoLocal.id });
          removidos++;
          styledLog(
            'products',
            `🔥 Produto excluído permanentemente: ${produtoLocal.name}`,
            'brightRed',
          );
        } else {
          await this.productRepository.update(
            { id: produtoLocal.id },
            { status: 'to_verify' },
          );
          marcados++;
          styledLog(
            'products',
            `🚨 Produto marcado para exclusão: ${produtoLocal.name}`,
            'brightYellow',
          );
        }
        continue;
      }

      // 3️⃣ Produto está "I" (inativo)
      if (situacaoBling === 'I') {
        if (produtoLocal.status !== 'inactive') {
          await this.productRepository.update(
            { id: produtoLocal.id },
            { status: 'inactive' },
          );
          inativados++;
          styledLog(
            'products',
            `⚫ Produto inativado: ${produtoLocal.name}`,
            'brightBlue',
          );
        }
        continue;
      }

      // 4️⃣ Produto reativado ("A")
      if (situacaoBling === 'A' && produtoLocal.status !== 'active') {
        await this.productRepository.update(
          { id: produtoLocal.id },
          { status: 'active' },
        );
        reativados++;
        styledLog(
          'products',
          `🔁 Produto reativado: ${produtoLocal.name}`,
          'green',
        );
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
  async upsertFromWebhook(
    data: any,
  ): Promise<{
    result: 'created' | 'updated';
    linkedCategory: boolean;
    status: 'active' | 'inactive' | 'to_verify';
  }> {
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

    // 🔹 Normaliza status Bling → Backend
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
      stock: stockQuantity,
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
      styledLog(
        'products',
        `♻️ Atualizado: ${nome} (${normalizedStatus})`,
        'green',
      );
      return {
        result: 'updated',
        linkedCategory: !!categoriaLocal,
        status: normalizedStatus,
      };
    }

    const novo = this.productRepository.create(base);
    await this.productRepository.save(novo);
    styledLog(
      'products',
      `🆕 Criado: ${nome} (${normalizedStatus})`,
      'brightGreen',
    );
    return {
      result: 'created',
      linkedCategory: !!categoriaLocal,
      status: normalizedStatus,
    };
  }

  async removeByBlingId(blingId: number) {
    await this.productRepository.delete({ blingId });
    styledLog(
      'products',
      `🗑️ Produto removido via webhook (BlingID: ${blingId})`,
      'red',
    );
  }
}

/*
🗓 23/10/2025 - 03:00
✅ Correção de tipagem e normalização de status Bling → Backend.
--------------------------------------------
📘 Lógica:
- Mantém blingId como number (compatível com entidade e banco).
- Converte IDs usando Number() antes de comparar.
- Normaliza status:
  "A" → "active", "I" → "inactive".
- Mantém ciclo seguro: marcar, remover e reativar.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
