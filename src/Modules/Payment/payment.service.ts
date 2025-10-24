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
    private readonly paymentMethodRepo: Repository<PaymentMethod>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

  ) {}

// src/Modules/Payment/payment.service.ts
async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
  const { orderId, userId, paymentMethodId, amount, ...rest } = createPaymentDto;

  const order = await this.orderRepo.findOne({ where: { id: orderId } });
  if (!order) throw new NotFoundException('Pedido não encontrado.');

  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException('Usuário não encontrado.');

  const paymentMethod = await this.paymentMethodRepo.findOne({ where: { id: paymentMethodId } });
  if (!paymentMethod) throw new NotFoundException('Método de pagamento não encontrado.');

  // 🚀 Criamos a entidade manualmente para evitar o problema do .create()
  const payment = new Payment();
  payment.order = Promise.resolve(order);
  payment.user = Promise.resolve(user);
  payment.paymentMethod = Promise.resolve(paymentMethod);
  payment.amount = amount;
  payment.status = 'pending';
  Object.assign(payment, rest);

  return await this.paymentRepo.save(payment);
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
