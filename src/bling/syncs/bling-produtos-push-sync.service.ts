// // src/syncs/bling-produtos-push.service.ts
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { BlingService } from 'src/bling/bling.service';
// import { Produto } from 'src/produto/produto.entity';

// @Injectable()
// export class BlingProdutosPushService {
//   constructor(
//     private readonly blingService: BlingService,
//     @InjectRepository(Produto)
//     private readonly produtoRepository: Repository<Produto>,
//   ) {}

//   /**
//    * Envia todos os produtos locais que ainda não foram sincronizados com o Bling.
//    */
//   async enviarProdutosNaoSincronizados() {
//     const produtosNaoSincronizados = await this.produtoRepository.find({
//       where: { sincronizado: false },
//     });

//     for (const produto of produtosNaoSincronizados) {
//       try {
//         const payload = this.mapearParaBling(produto);
//         const response = await this.blingService.criarProduto(payload);

//         if (response?.data?.data?.id) {
//           produto.blingId = response.data.data.id;
//           produto.sincronizado = true;
//           await this.produtoRepository.save(produto);
//         }
//       } catch (error) {
//         console.error(
//           `Erro ao enviar produto "${produto.nome}" para o Bling:`,
//           error.message,
//         );
//       }
//     }
//   }

//   /**
//    * Mapeia o produto local para o formato aceito pela API do Bling.
//    */
//   private mapearParaBling(produto: Produto) {
//     return {
//       nome: produto.nome,
//       codigo: produto.codigo,
//       preco: produto.preco,
//       tipo: 'P', // Produto
//       situacao: 'A', // Ativo
//       formato: 'S', // Simples
//       descricaoCurta: produto.descricao,
//       estoque: produto.quantidade,
//     };
//   }
// }
