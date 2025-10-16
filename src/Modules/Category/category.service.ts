// src/category/category.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly dataSource: DataSource
  ) {}

  // NOVO MÉTODO PARA SEED
  async seed(): Promise<{ message: string }> {
    const seedSql = `
      TRUNCATE TABLE category RESTART IDENTITY CASCADE;

      INSERT INTO category (name, "order") VALUES
      ('Cosmetics Facial', 1),
      ('Cosmetics Body', 2),
      ('Makeup', 3),
      ('Hair Care', 4),
      ('Kids Line', 5),
      ('Supplements & Wellness', 6),
      ('Promotions / Outlet', 7);

      UPDATE category SET path = id::text WHERE parent_id IS NULL;

      -- Subcategories
      -- Facial Cosmetics
      INSERT INTO category (name, "order", parent_id)
      SELECT sub.name, sub."order", parent.id FROM (VALUES ('Cleansing (soaps, toners)', 1),('Hydration (creams, serums, masks)', 2),('Anti-aging & Treatments', 3),('Facial Sunscreen', 4)) AS sub(name, "order")
      CROSS JOIN (SELECT id FROM category WHERE name = 'Cosmetics Facial') AS parent;

      -- Body Cosmetics
      INSERT INTO category (name, "order", parent_id)
      SELECT sub.name, sub."order", parent.id FROM (VALUES ('Moisturizers', 1),('Oils & Massage Creams', 2),('Anti-cellulite & Firming', 3),('Body Sunscreen', 4)) AS sub(name, "order")
      CROSS JOIN (SELECT id FROM category WHERE name = 'Cosmetics Body') AS parent;

      -- Makeup
      INSERT INTO category (name, "order", parent_id)
      SELECT sub.name, sub."order", parent.id FROM (VALUES ('Face (foundation, concealer, powder, blush, highlighter)', 1),('Eyes (eyeshadow, pencil, mascara, eyeliner)', 2),('Lips (lipsticks, gloss, pencil)', 3),('Kits & Palettes', 4)) AS sub(name, "order")
      CROSS JOIN (SELECT id FROM category WHERE name = 'Makeup') AS parent;

      -- Hair Care
      INSERT INTO category (name, "order", parent_id)
      SELECT sub.name, sub."order", parent.id FROM (VALUES ('Shampoos & Conditioners', 1),('Masks & Treatments', 2),('Finishers & Oils', 3),('Professional Kits', 4)) AS sub(name, "order")
      CROSS JOIN (SELECT id FROM category WHERE name = 'Hair Care') AS parent;

      -- Kids Line
      INSERT INTO category (name, "order", parent_id)
      SELECT sub.name, sub."order", parent.id FROM (VALUES ('Hygiene (shampoo, conditioner, soap)', 1),('Kids Hydration', 2),('Kids Sunscreen', 3),('Gentle Products', 4)) AS sub(name, "order")
      CROSS JOIN (SELECT id FROM category WHERE name = 'Kids Line') AS parent;

      -- Supplements & Wellness
      INSERT INTO category (name, "order", parent_id)
      SELECT sub.name, sub."order", parent.id FROM (VALUES ('Vitamins & Minerals', 1),('Collagen', 2),('Skin, Hair & Nails', 3),('Nutricosmetics', 4)) AS sub(name, "order")
      CROSS JOIN (SELECT id FROM category WHERE name = 'Supplements & Wellness') AS parent;

      -- Promotions / Outlet
      INSERT INTO category (name, "order", parent_id)
      SELECT sub.name, sub."order", parent.id FROM (VALUES ('Monthly Offers', 1),('Promotional Kits', 2),('Stock Clearance', 3)) AS sub(name, "order")
      CROSS JOIN (SELECT id FROM category WHERE name = 'Promotions / Outlet') AS parent;

      UPDATE category AS child SET path = parent.path || '/' || child.id::text FROM category AS parent WHERE child.parent_id = parent.id AND child.path IS NULL;
    `;

    await this.dataSource.query(seedSql);

    return { message: 'Category database seeded successfully!' };
  }

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
