import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './pedido.entity';
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
    if (produto.quantidadeEstoque < data.quantidade) throw new Error('Estoque insuficiente');

    const pedido = this.pedidoRepo.create({
      produto,
      usuario,
      quantidade: data.quantidade,
      valorProduto: produto.preco * data.quantidade,
      valorFrete: data.valorFrete,
      status: 'em análise',
    });

    produto.quantidadeEstoque -= data.quantidade;
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
}