import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { Categoria } from 'src/categoria/categoria.entity';

@Injectable()
export class ProdutoService {
  constructor(
    
    @InjectRepository(Produto)
    private produtoRepo: Repository<Produto>,
    @InjectRepository(Categoria)
    private categoriaRepo: Repository<Categoria>,
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

  async create(createProdutoDto: CreateProdutoDto) {
    const { categoriaId, ...resto } = createProdutoDto;

    const categoria = await this.categoriaRepo.findOne({
      where: { id: categoriaId },
    });

    const novoProduto = this.produtoRepo.create({
      ...resto,
      categoria: categoria ?? undefined,
    });

    return this.produtoRepo.save(novoProduto);
  }
  findAll() {
    return this.produtoRepo
      .find()
      .then((items) =>
        items.map((p) => ({
          ...p,
          imagens: Array.isArray(p.imagens) ? p.imagens : [],
        })),
      );
  }

  findOne(id: number) {
    return this.produtoRepo
      .findOneBy({ id })
      .then((p) =>
        p ? { ...p, imagens: Array.isArray(p.imagens) ? p.imagens : [] } : null,
      );
  }

  update(id: number, produto: Partial<Produto>) {
    return this.produtoRepo.update(id, produto);
  }

  delete(id: number) {
    return this.produtoRepo.delete(id);
  }
}
