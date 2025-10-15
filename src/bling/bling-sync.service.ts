// // src/bling/bling-sync.service.ts
// import { Injectable, Logger } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import axios from 'axios';
// import { Produto } from 'src/produto/produto.entity';
// import { Categoria } from 'src/categoria/categoria.entity';

// @Injectable()
// export class BlingSyncService {
//   private readonly logger = new Logger(BlingSyncService.name);
//   private readonly baseUrl = 'https://api.bling.com.br/Api/v3';

//   constructor(
//     @InjectRepository(Produto)
//     private readonly produtoRepository: Repository<Produto>,
//     @InjectRepository(Categoria)
//     private readonly categoriaRepository: Repository<Categoria>,
//   ) {}

//   /**
//    * Sincroniza categorias do Bling.
//    */
//   private async sincronizarCategorias(): Promise<Map<number, Categoria>> {
//     const token = process.env.BLING_ACCESS_TOKEN?.trim();
//     if (!token) {
//       this.logger.error('Token de acesso ao Bling não configurado.');
//       return new Map();
//     }

//     this.logger.log('Sincronizando categorias do Bling...');

//     const response = await axios.get(`${this.baseUrl}/categorias/json`, {
//       params: { apikey: token },
//     });

//     const categoriasBling = response.data?.data || [];
//     const mapCategorias = new Map<number, Categoria>();

//     for (const item of categoriasBling) {
//       let categoria = await this.categoriaRepository.findOne({
//         where: { nome: item.descricao },
//       });

//       if (!categoria) {
//         categoria = this.categoriaRepository.create({ nome: item.descricao });
//       }

//       if (item.categoriaPai?.id && item.categoriaPai.id !== 0) {
//         let parent = mapCategorias.get(item.categoriaPai.id);

//         if (!parent) {
//           parent = await this.categoriaRepository.findOne({ where: { id: item.categoriaPai.id } });
//         }

//         if (!parent) {
//           parent = this.categoriaRepository.create({
//             id: item.categoriaPai.id,
//             nome: `Categoria Pai #${item.categoriaPai.id}`,
//           });
//           await this.categoriaRepository.save(parent);
//         }

//         categoria.parent = parent;
//       } else {
//         categoria.parent = undefined;
//       }

//       await this.categoriaRepository.save(categoria);

//       // Atualiza path
//       categoria.path = categoria.parent ? `${categoria.parent.path}/${categoria.id}` : `${categoria.id}`;
//       await this.categoriaRepository.save(categoria);

//       mapCategorias.set(item.id, categoria);
//     }

//     this.logger.log('Categorias sincronizadas com sucesso!');
//     return mapCategorias;
//   }

//   /**
//    * Sincroniza produtos do Bling.
//    */
//   async sincronizarProdutos(): Promise<void> {
//     const token = process.env.BLING_ACCESS_TOKEN?.trim();
//     if (!token) {
//       this.logger.error('Token de acesso ao Bling não configurado.');
//       return;
//     }

//     this.logger.log('Iniciando sincronização de produtos com o Bling...');

//     const mapCategorias = await this.sincronizarCategorias();

//     const response = await axios.get(`${this.baseUrl}/produtos/json`, {
//       params: { apikey: token },
//     });

//     const produtosBling = response.data?.retorno?.produtos || [];

//     for (const item of produtosBling) {
//       const produtoData = item.produto;

//       // Categoria
//       let categoria: Categoria | undefined = undefined;
//       if (produtoData.categoria?.id) {
//         categoria = mapCategorias.get(produtoData.categoria.id);
//       }

//       const produtoPayload: Partial<Produto> = {
//         blingId: produtoData.codigo ? Number(produtoData.codigo) : undefined,
//         codigo: produtoData.codigo || `BLING-${produtoData.codigo}`,
//         nome: produtoData.descricao || 'Sem nome',
//         preco: Number(produtoData.preco || 0),
//         quantidadeEstoque: Number(produtoData.estoque?.saldo ?? 0),
//         descricao: produtoData.descricaoCurta || produtoData.descricao || '',
//         imagens: produtoData.imagens?.map((img) => img.url) || [],
//         categoria,
//         sincronizado: true,
//       };

//       let produto = await this.produtoRepository.findOne({
//         where: [{ blingId: produtoPayload.blingId }, { codigo: produtoPayload.codigo }],
//       });

//       if (produto) {
//         produto = this.produtoRepository.merge(produto, produtoPayload);
//         await this.produtoRepository.save(produto);
//         this.logger.log(`Produto atualizado: ${produto.nome} (${produto.codigo})`);
//       } else {
//         produto = this.produtoRepository.create(produtoPayload);
//         await this.produtoRepository.save(produto);
//         this.logger.log(`Produto criado: ${produto.nome} (${produto.codigo})`);
//       }
//     }

//     this.logger.log('Sincronização de produtos concluída com sucesso!');
//   }
// }
