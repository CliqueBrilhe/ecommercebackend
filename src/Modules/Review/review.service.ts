// src/Modules/Review/review.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { User } from '../User/entities/user.entity';
import { Product } from '../Product/entities/product.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  /**
   * Cria uma nova avaliação.
   */
  async create(dto: CreateReviewDto): Promise<Review> {
    const { userId, productId, rating, comment } = dto;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Produto não encontrado.');

    const review = this.reviewRepo.create({
      user,
      product,
      rating,
      comment,
    });

    return this.reviewRepo.save(review);
  }

  /**
   * Lista todas as avaliações.
   */
  async findAll(): Promise<Review[]> {
    return this.reviewRepo.find({
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Busca avaliações de um produto específico.
   */
  async findByProduct(productId: number): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { product: { id: productId } },
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Busca avaliações feitas por um usuário.
   */
  async findByUser(userId: number): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Atualiza uma avaliação existente.
   */
  async update(id: number, dto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Avaliação não encontrada.');

    Object.assign(review, dto);
    return this.reviewRepo.save(review);
  }

  /**
   * Remove uma avaliação.
   */
  async delete(id: number): Promise<void> {
    const result = await this.reviewRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Avaliação não encontrada.');
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 03:20
- Criado serviço completo de avaliações.
--------------------------------------------
Explicação da lógica:
Gerencia criação, leitura, atualização e exclusão de avaliações
de produtos, com suporte a buscas por produto e usuário.
by: gabbu (github: gabriellesote)
*/
