// src/order/order.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../Product/entities/product.entity';
import { User } from '../User/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const { productId, userId, quantity, shippingValue } = createOrderDto;

    const product = await this.productRepo.findOneBy({ id: productId });
    const user = await this.userRepo.findOneBy({ id: userId });

    if (!product) throw new Error('Produto não encontrado');
    if (!user) throw new Error('Usuário não encontrado');
    if (product.stock < quantity) throw new Error('Estoque insuficiente');


    const order = this.orderRepo.create({
      product,
      user,
      quantity,
      productValue: product.price * quantity,
      shippingValue,
      status: 'under_review',
    });

    product.stock -= quantity;
    await this.productRepo.save(product);

    return this.orderRepo.save(order);
  }

  findAll(): Promise<Order[]> {
    return this.orderRepo.find({ relations: ['product', 'user'] });
  }

  findByCpf(cpf: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { user: { cpf } },
      relations: ['user'],
    });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return this.orderRepo.update(id, updateOrderDto);
  }

  delete(id: number) {
    return this.orderRepo.delete(id);
  }
}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração do service de pedidos para utilizar DTOs (CreateOrderDto e UpdateOrderDto)
// --------------------------------------------------------------
// Explicação da lógica:
// Service responsável pelo gerenciamento de pedidos. Agora recebe DTOs nos métodos
// de criação e atualização, garantindo validação e tipagem.
// by: gabbu (github: gabriellesote)
