// src/Modules/Wishlist/wishlist.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './entities/wishlist-item.entity';
import { User } from '../User/entities/user.entity';
import { Product } from '../Product/entities/product.entity';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';
import { UpdateWishlistItemDto } from './dto/update-wishlist-item.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly wishlistRepo: Repository<WishlistItem>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  /**
   * Adiciona um produto à lista de desejos do usuário.
   */
  async create(dto: CreateWishlistItemDto): Promise<WishlistItem> {
    const { userId, productId } = dto;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Produto não encontrado.');

    const existing = await this.wishlistRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (existing) throw new ConflictException('Produto já está na lista de desejos.');

    const item = this.wishlistRepo.create({ user, product });
    return await this.wishlistRepo.save(item);
  }

  /**
   * Lista todos os itens da lista de desejos.
   */
  async findAll(): Promise<WishlistItem[]> {
    return this.wishlistRepo.find({
      relations: ['user', 'product'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Lista a lista de desejos de um usuário específico.
   */
  async findByUser(userId: number): Promise<WishlistItem[]> {
    const items = await this.wishlistRepo.find({
      where: { user: { id: userId } },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });

    if (!items || items.length === 0)
      throw new NotFoundException('Nenhum item encontrado para este usuário.');

    return items;
  }

  /**
   * Remove um item da lista de desejos.
   */
  async delete(id: number): Promise<void> {
    const result = await this.wishlistRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Item da lista de desejos não encontrado.');
  }

  /**
   * Remove um item específico (por usuário + produto).
   */
  async removeByUserAndProduct(userId: number, productId: number): Promise<void> {
    const item = await this.wishlistRepo.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (!item)
      throw new NotFoundException('Item não encontrado na lista de desejos.');
    await this.wishlistRepo.delete(item.id);
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 03:55
- Criado serviço de lista de desejos (WishlistService) com CRUD e verificações.
--------------------------------------------
Explicação da lógica:
Gerencia adição, listagem e remoção de itens da lista de desejos,
evitando duplicidades e garantindo integridade com usuário e produto.
by: gabbu (github: gabriellesote)
*/
