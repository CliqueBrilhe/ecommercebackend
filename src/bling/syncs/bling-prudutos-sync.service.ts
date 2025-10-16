// src/bling/syncs/bling-produtos-sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Produto } from 'src/Modules/produto/produto.entity';
import { Categoria } from 'src/categoria/categoria.entity';

/**
 * Serviço responsável por sincronizar produtos do Bling
 * com o banco local. Atualiza produtos existentes e cria novos.
 */
@Injectable()
export class BlingProdutosSyncService {
  private readonly logger = new Logger(BlingProdutosSyncService.name);
  private readonly baseUrl = 'https://api.bling.com.br/Api/v3';

  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,

    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
  ) {}

  /**
   * Sincroniza os produtos do Bling.
   * Atualiza produtos existentes ou cria novos, mantendo a coluna 'sincronizado'.
   */
  async sincronizarProdutos(): Promise<void> {
    const token = process.env.BLING_ACCESS_TOKEN?.trim();
    if (!token) {
      this.logger.error('Token de acesso ao Bling não configurado.');
      return;
    }

    this.logger.log('Iniciando sincronização de produtos com o Bling...');

    try {
      const response = await axios.get(`${this.baseUrl}/produtos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const produtos = response.data?.data;
      if (!Array.isArray(produtos)) {
        this.logger.warn('Nenhum produto encontrado no Bling.');
        return;
      }

      for (const item of produtos) {
        const blingId = item.id;
        const codigo = item.codigo || `BLING-${blingId}`;
        const nome = item.nome || 'Sem nome';
        const preco = parseFloat(item.preco || 0);
        const quantidadeEstoque = parseInt(item.estoque?.saldo || 0);
        const descricao = item.descricao || '';
        const imagens = item.imagens?.map((img) => img.link) || [];

        // Se Bling retornar categoria, tenta encontrar localmente
        let categoria: Categoria | undefined = undefined;
        if (item.categoria?.id) {
          categoria = await this.categoriaRepository.findOne({
            where: { id: item.categoria.id },
          }) || undefined;
        }

        // Tenta encontrar produto local com mesmo blingId ou código
        let produto = await this.produtoRepository.findOne({
          where: [{ blingId }, { codigo }],
        });

        if (produto) {
          // Atualiza produto existente
          produto.nome = nome;
          produto.preco = preco;
          produto.descricao = descricao;
          produto.imagens = imagens;
          produto.quantidadeEstoque = quantidadeEstoque;
          produto.categoria = categoria;
          produto.sincronizado = true;
          produto.atualizadoEm = new Date();

          await this.produtoRepository.save(produto);
          this.logger.log(`Produto atualizado: ${nome} (${codigo})`);
        } else {
          // Cria novo produto local
          produto = this.produtoRepository.create({
            blingId,
            codigo,
            nome,
            preco,
            descricao,
            imagens,
            quantidadeEstoque,
            categoria,
            sincronizado: true,
          });

          await this.produtoRepository.save(produto);
          this.logger.log(`Produto criado: ${nome} (${codigo})`);
        }
      }

      this.logger.log('Sincronização de produtos concluída com sucesso.');
    } catch (error: any) {
      this.logger.error('Erro ao sincronizar produtos:', error.message);
    }
  }
}
