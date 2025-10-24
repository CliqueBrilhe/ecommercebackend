// src/Modules/Payment/payment.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { User } from '../User/entities/user.entity';
import { Order } from '../Order/entities/order.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(PaymentMethod)
    private readonly methodRepo: Repository<PaymentMethod>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const { userId, orderId, paymentMethodId, amount, ...rest } = createPaymentDto;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Pedido não encontrado.');

    const method = await this.methodRepo.findOne({ where: { id: paymentMethodId } });
    if (!method) throw new NotFoundException('Método de pagamento não encontrado.');

    if (amount <= 0) throw new BadRequestException('Valor do pagamento inválido.');

    const payment = this.paymentRepo.create({
      user,
      order,
      paymentMethod: method,
      amount,
      ...rest,
    });

    return this.paymentRepo.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepo.find({
      relations: ['user', 'order', 'paymentMethod'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { user: { id: userId } },
      relations: ['order', 'paymentMethod'],
    });
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Pagamento não encontrado.');

    Object.assign(payment, updatePaymentDto);
    return this.paymentRepo.save(payment);
  }

  async delete(id: number): Promise<void> {
    const result = await this.paymentRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Pagamento não encontrado para exclusão.');
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 00:45
- Criação do PaymentService com CRUD completo e validações
--------------------------------------------
Explicação da lógica:
O serviço gerencia pagamentos e valida relações com usuários, pedidos
e métodos de pagamento. Suporta criação, atualização, listagem e exclusão,
com validação de valores e IDs.
by: gabbu (github: gabriellesote) ✧
*/
