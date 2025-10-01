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

  
  async getCategorias(): Promise<string[]> {
  const result = await this.produtoRepo
    .createQueryBuilder('produto')
    .select('DISTINCT produto.categoria', 'categoria')
    .where('produto.categoria IS NOT NULL')
    .andWhere("produto.categoria <> ''")
    .getRawMany();

  return result
    .map((r: { categoria: string }) => (r.categoria ?? '').trim())
    .filter((c) => c.length > 0);
}
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

}