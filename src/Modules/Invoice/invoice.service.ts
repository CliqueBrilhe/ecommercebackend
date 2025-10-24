// src/Modules/Invoice/invoice.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { Order } from '../Order/entities/order.entity';
import { User } from '../User/entities/user.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Cria uma nova nota fiscal.
   */
  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const { orderId, userId, ...rest } = createInvoiceDto;

    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Pedido não encontrado.');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const invoice = this.invoiceRepo.create({
      order,
      user,
      ...rest,
      status: rest.status ?? 'pending',
    });

    return await this.invoiceRepo.save(invoice);
  }

  /**
   * Retorna todas as notas fiscais.
   */
  async findAll(): Promise<Invoice[]> {
    return this.invoiceRepo.find({
      relations: ['user', 'order'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Busca nota fiscal por ID.
   */
  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepo.findOne({
      where: { id },
      relations: ['user', 'order'],
    });
    if (!invoice) throw new NotFoundException('Nota fiscal não encontrada.');
    return invoice;
  }

  /**
   * Busca notas fiscais por ID de usuário.
   */
  async findByUser(userId: number): Promise<Invoice[]> {
    return this.invoiceRepo.find({
      where: { user: { id: userId } },
      relations: ['order'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Atualiza uma nota fiscal.
   */
  async update(id: number, updateInvoiceDto: UpdateInvoiceDto): Promise<Invoice> {
    const invoice = await this.findOne(id);
    Object.assign(invoice, updateInvoiceDto);
    return this.invoiceRepo.save(invoice);
  }

  /**
   * Remove uma nota fiscal.
   */
  async delete(id: number): Promise<void> {
    const result = await this.invoiceRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Nota fiscal não encontrada.');
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 02:45
- Implementado CRUD completo de notas fiscais (InvoiceService).
--------------------------------------------
Explicação da lógica:
Gerencia criação e controle de notas fiscais ligadas a pedidos e usuários.
Inclui métodos de listagem, busca e atualização de status.
by: gabbu (github: gabriellesote)
*/
