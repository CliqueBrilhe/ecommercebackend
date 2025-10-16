import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Categoria } from './categoria.entity';
import { CreateCategoriaDto } from './dto/create-category.dto';
import { UpdateCategoriaDto } from './dto/update-category.dto';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    private readonly dataSource: DataSource
  ) {}


  // NOVO MÉTODO PARA SEED
  async seed(): Promise<{ message: string }> {
    // 3. O script SQL do seu Canvas.
    const seedSql = `
      -- ATENÇÃO: ESTE COMANDO APAGARÁ TODAS AS CATEGORIAS EXISTENTES ANTES DE INSERIR AS NOVAS.
      TRUNCATE TABLE categoria RESTART IDENTITY CASCADE;

      -- Passo 1: Inserir todas as categorias principais (nível 1)
      INSERT INTO categoria (nome, ordem) VALUES
      ('Cosméticos Faciais', 1),
      ('Cosméticos Corporais', 2),
      ('Maquiagem', 3),
      ('Linha Capilar', 4),
      ('Linha Infantil', 5),
      ('Suplementos & Bem-estar', 6),
      ('Promoções / Outlet', 7);

      -- Passo 2: Atualizar o 'path' das categorias principais para ser o seu próprio ID.
      UPDATE categoria SET path = id::text WHERE parent_id IS NULL;

      -- Passo 3: Inserir as subcategorias (nível 2)
      -- Subcategorias de 'Cosméticos Faciais'
      INSERT INTO categoria (nome, ordem, parent_id)
      SELECT sub.nome, sub.ordem, parent.id FROM (VALUES ('Limpeza (sabonetes, demaquilantes, tônicos)', 1),('Hidratação (cremes, séruns, máscaras)', 2),('Anti-idade e Tratamentos', 3),('Protetor Solar Facial', 4)) AS sub(nome, ordem)
      CROSS JOIN (SELECT id FROM categoria WHERE nome = 'Cosméticos Faciais') AS parent;

      -- Subcategorias de 'Cosméticos Corporais'
      INSERT INTO categoria (nome, ordem, parent_id)
      SELECT sub.nome, sub.ordem, parent.id FROM (VALUES ('Hidratantes', 1),('Óleos e Cremes de Massagem', 2),('Anticelulite & Firmadores', 3),('Protetor Solar Corporal', 4)) AS sub(nome, ordem)
      CROSS JOIN (SELECT id FROM categoria WHERE nome = 'Cosméticos Corporais') AS parent;

      -- Subcategorias de 'Maquiagem'
      INSERT INTO categoria (nome, ordem, parent_id)
      SELECT sub.nome, sub.ordem, parent.id FROM (VALUES ('Rosto (base, corretivo, pó, blush, iluminador)', 1),('Olhos (sombra, lápis, rímel, delineador)', 2),('Boca (batons, gloss, lápis labial)', 3),('Kits e Paletas', 4)) AS sub(nome, ordem)
      CROSS JOIN (SELECT id FROM categoria WHERE nome = 'Maquiagem') AS parent;

      -- Subcategorias de 'Linha Capilar'
      INSERT INTO categoria (nome, ordem, parent_id)
      SELECT sub.nome, sub.ordem, parent.id FROM (VALUES ('Shampoos e Condicionadores', 1),('Máscaras e Tratamentos', 2),('Finalizadores e Óleos', 3),('Kits Profissionais', 4)) AS sub(nome, ordem)
      CROSS JOIN (SELECT id FROM categoria WHERE nome = 'Linha Capilar') AS parent;

      -- Subcategorias de 'Linha Infantil'
      INSERT INTO categoria (nome, ordem, parent_id)
      SELECT sub.nome, sub.ordem, parent.id FROM (VALUES ('Higiene (shampoo, condicionador, sabonete)', 1),('Hidratação Infantil', 2),('Protetor Solar Kids', 3),('Produtos Suaves', 4)) AS sub(nome, ordem)
      CROSS JOIN (SELECT id FROM categoria WHERE nome = 'Linha Infantil') AS parent;

      -- Subcategorias de 'Suplementos & Bem-estar'
      INSERT INTO categoria (nome, ordem, parent_id)
      SELECT sub.nome, sub.ordem, parent.id FROM (VALUES ('Vitaminas & Minerais', 1),('Colágeno', 2),('Pele, Cabelo e Unhas', 3),('Nutricosméticos', 4)) AS sub(nome, ordem)
      CROSS JOIN (SELECT id FROM categoria WHERE nome = 'Suplementos & Bem-estar') AS parent;

      -- Subcategorias de 'Promoções / Outlet'
      INSERT INTO categoria (nome, ordem, parent_id)
      SELECT sub.nome, sub.ordem, parent.id FROM (VALUES ('Ofertas do Mês', 1),('Kits Promocionais', 2),('Queima de Estoque', 3)) AS sub(nome, ordem)
      CROSS JOIN (SELECT id FROM categoria WHERE nome = 'Promoções / Outlet') AS parent;

      -- Passo 4: Atualizar o 'path' de todas as subcategorias
      UPDATE categoria AS child SET path = parent.path || '/' || child.id::text FROM categoria AS parent WHERE child.parent_id = parent.id AND child.path IS NULL;
    `;

    // 4. Executa a query SQL pura.
    await this.dataSource.query(seedSql);

    return { message: 'Banco de dados de categorias semeado com sucesso!' };
  }











  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    const { nome, ordem, parentId } = createCategoriaDto;

    const categoria = this.categoriaRepository.create({ nome, ordem });

    // Se um parentId foi fornecido, encontramos a categoria pai.
    if (parentId) {
      const parent = await this.findOne(parentId);
      categoria.parent = parent;
    }

    // Primeiro, salvamos a categoria para que ela obtenha um ID.
    const novaCategoria = await this.categoriaRepository.save(categoria);

    // Agora, construímos o path.
    if (novaCategoria.parent) {
      // O path é o path do pai + o ID da nova categoria.
      novaCategoria.path = `${novaCategoria.parent.path}/${novaCategoria.id}`;
    } else {
      // Se for uma categoria raiz, o path é apenas seu próprio ID.
      novaCategoria.path = `${novaCategoria.id}`;
    }

    // Salvamos novamente para atualizar o path no banco de dados.
    return this.categoriaRepository.save(novaCategoria);
  }

  findAll(): Promise<Categoria[]> {
    // Retorna todas as categorias com seus relacionamentos de filhos.
    return this.categoriaRepository.find({ relations: ['children'] });
  }

  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!categoria) {
      throw new NotFoundException(`Categoria com o ID ${id} não encontrada.`);
    }
    return categoria;
  }

  async update(
    id: number,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<Categoria> {
    // Pré-carrega a categoria existente. Lança um erro se não for encontrada.
    const categoria = await this.categoriaRepository.preload({
      id,
      ...updateCategoriaDto,
    });

    if (!categoria) {
      throw new NotFoundException(`Categoria com o ID ${id} não encontrada.`);
    }
    
    // NOTA: Mudar o 'parent' de uma categoria existente é uma operação complexa,
    // pois exigiria recalcular o 'path' de todos os seus descendentes.
    // Esta implementação básica não cobre essa funcionalidade.

    return this.categoriaRepository.save(categoria);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoriaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Categoria com o ID ${id} não encontrada.`);
    }
  }
}
