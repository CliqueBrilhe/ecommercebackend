import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido,  StatusPedido } from './pedido.entity';
import { Produto } from '../produto/produto.entity';
import { Usuario } from '../usuario/usuario.entity';

@Injectable()
export class PedidoService {
  constructor(
    @InjectRepository(Pedido)
    private pedidoRepo: Repository<Pedido>,
    @InjectRepository(Produto)
    private produtoRepo: Repository<Produto>,
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  async create(data: {
    produtoId: number;
    usuarioId: number;
    quantidade: number;
    valorFrete: number;
  }) {
    const produto = await this.produtoRepo.findOneBy({ id: data.produtoId });
    const usuario = await this.usuarioRepo.findOneBy({ id: data.usuarioId });

    if (!produto) throw new Error('Produto não encontrado');
    if (!usuario) throw new Error('Usuário não encontrado');
    
    // --- CORREÇÃO DO ERRO NaN: Garantindo que são números ---
    
    // Converte os valores para números antes de usar/comparar.
    // O 'as any' ajuda o TypeScript a aceitar a conversão de um tipo desconhecido.
    const estoqueAtual = parseInt(produto.quantidadeEstoque as any, 10);
    const quantidadeDesejada = parseInt(data.quantidade as any, 10);

    if (estoqueAtual < quantidadeDesejada) throw new Error('Estoque insuficiente');

    const pedido = this.pedidoRepo.create({
      produto,
      usuario,
      quantidade: quantidadeDesejada,
      // Usando Number() para garantir que preco e valorFrete são usados como decimais
      valorProduto: Number(produto.preco) * quantidadeDesejada,
      valorFrete: Number(data.valorFrete),
      status: 'em análise',
    });

    // Subtração segura com números válidos
    produto.quantidadeEstoque = estoqueAtual - quantidadeDesejada;
    await this.produtoRepo.save(produto);

    return this.pedidoRepo.save(pedido);
  }







  findAll() {
    return this.pedidoRepo.find({ relations: ['produto', 'usuario'] });
  }

  findByCpf(cpf: string) {
    return this.pedidoRepo.find({
      where: { usuario: { cpf } },
      relations: ['usuario'],
    });
  }

  update(id: number, updateData: Partial<Pedido>) {
    return this.pedidoRepo.update(id, updateData);
  }

  delete(id: number) {
    return this.pedidoRepo.delete(id);
  }



//  ---- 07/10/2025 - By: gabbu

 // NOVO MÉTODO: Atualiza o status do pedido
  async updateStatus(id: number, newStatus: StatusPedido) {
    const pedido = await this.pedidoRepo.findOneBy({ id });

    if (!pedido) throw new Error('Pedido não encontrado');

    // Verifica se o status é válido (embora o TypeORM já ajude nisso)
    if (newStatus !== 'aprovado' && newStatus !== 'reprovado') {
        throw new Error("Status inválido. Use 'aprovado' ou 'reprovado'.");
    }

    // LÓGICA DE PAGAMENTO SERÁ IMPLEMENTADA AQUI MAIS TARDE
    
    // Atualiza o status
    pedido.status = newStatus;

    return this.pedidoRepo.save(pedido);
  }



}




 