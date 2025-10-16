// src/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '.././Category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async getCategories(): Promise<string[]> {
    const result = await this.productRepo
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .where('product.category IS NOT NULL')
      .andWhere("product.category <> ''")
      .getRawMany();

    return result
      .map((r: { category: string }) => (r.category ?? '').trim())
      .filter((c) => c.length > 0);
  }

  async create(createProductDto: CreateProductDto) {
    const { categoryId, ...rest } = createProductDto;

    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });

    const newProduct = this.productRepo.create({
      ...rest,
      category: category ?? undefined,
    });

    return this.productRepo.save(newProduct);
  }

  findAll() {
    return this.productRepo
      .find()
      .then((items) =>
        items.map((p) => ({
          ...p,
          category: p.category ? p.category.id : null,
          images: Array.isArray(p.images) ? p.images : [],
        })),
      );
  }

  findOne(id: number) {
    return this.productRepo
      .findOneBy({ id })
      .then((p) =>
        p ? { ...p, images: Array.isArray(p.images) ? p.images : [] } : null,
      );
  }

  update(id: number, product: Partial<Product>) {
    return this.productRepo.update(id, product);
  }

  delete(id: number) {
    return this.productRepo.delete(id);
  }
}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração de nomenclaturas para inglês (service, métodos, variáveis e parâmetros)
// --------------------------------------------------------------
// Explicação da lógica:
// Este service gerencia os produtos do e-commerce, oferecendo métodos para criar, listar,
// buscar, atualizar e deletar produtos, além de recuperar categorias distintas.
// As funções lidam com mapeamentos de categoria e garantem que arrays de imagens sejam sempre válidos.
// by: gabbu (github: gabriellesote)
