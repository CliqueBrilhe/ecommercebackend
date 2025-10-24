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

  /**
   * Cria um novo pedido, associando usuário, produtos e valores.
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, items, shippingCost = 0, discount = 0 } = createOrderDto;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    if (!items || items.length === 0) {
      throw new BadRequestException('O pedido deve conter pelo menos um item.');
    }

    let totalAmount = 0;
    const orderItems: OrderItem[] = [];

    // Processar cada item do pedido
    for (const item of items) {
      const product = await this.productRepo.findOne({ where: { id: item.productId } });
      if (!product) throw new NotFoundException(`Produto ID ${item.productId} não encontrado.`);

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Estoque insuficiente para o produto ${product.name}.`);
      }

      // Calcula subtotal e atualiza estoque
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

    // Cria o pedido principal
    const order = this.orderRepo.create({
      user,
      items: orderItems,
      totalAmount: totalAmount + shippingCost - discount,
      shippingCost,
      discount,
      status: 'pending',
      synchronized: false,
    });

    return await this.orderRepo.save(order);
  }

  /**
   * Retorna todos os pedidos com suas relações principais.
   */
  async findAll(): Promise<Order[]> {
    return this.orderRepo.find({
      relations: ['user', 'items', 'items.product', 'payments', 'invoice'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Retorna todos os pedidos de um usuário via CPF.
   */
  async findByCpf(cpf: string): Promise<Order[]> {
    return this.orderRepo.find({
      where: { user: { cpf } },
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Atualiza dados de um pedido existente.
   */
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id }, relations: ['items'] });
    if (!order) throw new NotFoundException('Pedido não encontrado.');

    Object.assign(order, updateOrderDto);
    return this.orderRepo.save(order);
  }

  /**
   * Remove um pedido pelo ID.
   */
  async delete(id: number): Promise<void> {
    const result = await this.orderRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Pedido não encontrado para exclusão.');
    }
  }
}

/*
Histórico de alterações:
Edição: 24/10/2025 - 22:55
- Reescrito para alinhar com nova entidade Order e OrderItem
- Implementado cálculo automático do valor total (subtotal + frete - desconto)
- Controle de estoque e relação ManyToOne/OneToMany com Product e User
- Adicionadas validações e exceptions padronizadas
--------------------------------------------
Explicação da lógica:
O OrderService gerencia a criação, listagem, atualização e exclusão de pedidos.
Durante a criação, ele valida o estoque dos produtos, calcula subtotal e total,
cria os itens do pedido e relaciona o pedido ao usuário. Inclui controle de frete,
desconto e status inicial "pending". Integra diretamente com Product e User.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
