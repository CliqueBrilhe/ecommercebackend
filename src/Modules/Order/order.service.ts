// src/Modules/Order/order.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../Product/entities/product.entity';
import { User } from '../User/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, items, shippingCost = 0, discount = 0 } = createOrderDto;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    if (!items?.length) throw new BadRequestException('O pedido deve conter pelo menos um item.');

    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.productRepo.findOne({ where: { id: item.productId } });
      if (!product) throw new NotFoundException(`Produto ID ${item.productId} não encontrado.`);

      if (product.stock < item.quantity)
        throw new BadRequestException(`Estoque insuficiente para ${product.name}.`);

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      product.stock -= item.quantity;
      await this.productRepo.save(product);

      const orderItem = this.orderItemRepo.create({
        product,
        quantity: item.quantity,
        price: product.price,
        subtotal,
      });

      orderItems.push(orderItem);
    }

    const order = this.orderRepo.create({
      user,
      items: orderItems,
      totalAmount: totalAmount + shippingCost - discount,
      shippingCost,
      discount,
      status: 'pending',
      synchronized: false,
    });

    return this.orderRepo.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepo.find({
      relations: ['user', 'items', 'items.product', 'payments', 'invoice'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByCpf(cpf: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { user: { cpf } },
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id }, relations: ['items'] });
    if (!order) throw new NotFoundException('Pedido não encontrado.');

    Object.assign(order, updateOrderDto);
    return this.orderRepo.save(order);
  }

  async delete(id: number): Promise<void> {
    const result = await this.orderRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Pedido não encontrado para exclusão.');
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 00:15
- Ajustado método create para aceitar userId via token
- Mantida lógica de cálculo de subtotal e atualização de estoque
--------------------------------------------
Explicação da lógica:
O serviço de pedidos cria e gerencia pedidos, calculando valores totais,
atualizando estoque e mantendo o vínculo entre produtos, usuário e pagamentos.
by: gabbu (github: gabriellesote) ✧
*/
