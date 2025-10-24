// src/Modules/Cart/cart.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../Product/entities/product.entity';
import { User } from '../User/entities/user.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Cria um novo carrinho para o usuário.
   */
  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const { userId, items } = createCartDto;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    if (!items || items.length === 0) {
      throw new BadRequestException('O carrinho deve conter pelo menos um item.');
    }

    let total = 0;
    const cartItems: CartItem[] = [];

    for (const item of items) {
      const product = await this.productRepo.findOne({ where: { id: item.productId } });
      if (!product) throw new NotFoundException(`Produto ID ${item.productId} não encontrado.`);

      const subtotal = product.price * item.quantity;
      total += subtotal;

      const cartItem = this.cartItemRepo.create({
        product,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });
      cartItems.push(cartItem);
    }

    const cart = this.cartRepo.create({
      user,
      items: cartItems,
      total,
      status: 'active',
    });

    return await this.cartRepo.save(cart);
  }

  /**
   * Lista todos os carrinhos.
   */
  async findAll(): Promise<Cart[]> {
    return this.cartRepo.find({
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Busca carrinho por ID.
   */
  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartRepo.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
    if (!cart) throw new NotFoundException('Carrinho não encontrado.');
    return cart;
  }

  /**
   * Atualiza o status ou itens do carrinho.
   */
  async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.cartRepo.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!cart) throw new NotFoundException('Carrinho não encontrado.');

    Object.assign(cart, updateCartDto);
    return await this.cartRepo.save(cart);
  }

  /**
   * Remove carrinho.
   */
  async delete(id: number): Promise<void> {
    const result = await this.cartRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Carrinho não encontrado.');
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 02:10
- Implementado CRUD completo de carrinhos com cálculo automático do total.
--------------------------------------------
Explicação da lógica:
O serviço de carrinhos gerencia a criação, leitura, atualização e exclusão,
calculando automaticamente os subtotais e o valor total do carrinho.
by: gabbu (github: gabriellesote)
*/
