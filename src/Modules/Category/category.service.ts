// src/category/category.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}


  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { name, order, parentId } = createCategoryDto;

    const category = this.categoryRepository.create({ name, order });

    if (parentId) {
      const parent = await this.findOne(parentId);
      category.parent = parent;
    }

    const newCategory = await this.categoryRepository.save(category);

    if (newCategory.parent) {
      newCategory.path = `${newCategory.parent.path}/${newCategory.id}`;
    } else {
      newCategory.path = `${newCategory.id}`;
    }

    return this.categoryRepository.save(newCategory);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['children'] });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }

    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found.`);
    }
  }
}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração de nomenclaturas para inglês (service, métodos, variáveis, DTOs e seed SQL)
// --------------------------------------------------------------
// Explicação da lógica:
// Este service gerencia categorias de produtos, incluindo criação, listagem, busca, atualização,
// remoção e seed do banco de dados. O método seed cria categorias e subcategorias com paths corretos.
// by: gabbu (github: gabriellesote)
