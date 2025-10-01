import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './produto.entity';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtoRepo: Repository<Produto>,
  ) {}

  create(produto: Produto) {
    return this.produtoRepo.save(produto);
  }

  findAll() {
    return this.produtoRepo.find();
  }

  findOne(id: number) {
    return this.produtoRepo.findOneBy({ id });
  }

  update(id: number, produto: Partial<Produto>) {
    return this.produtoRepo.update(id, produto);
  }

  delete(id: number) {
    return this.produtoRepo.delete(id);
  }

  async getCategorias(): Promise<string[]> {
    const result = await this.produtoRepo
      .createQueryBuilder('product')
      .select('DISTINCT product.categoria', 'categoria')
      .getRawMany();

    return result.map(r => r.categoria);
  }
}