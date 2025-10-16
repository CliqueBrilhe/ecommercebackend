// src/order/order.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':cpf')
  findByCpf(@Param('cpf') cpf: string): Promise<Order[]> {
    return this.orderService.findByCpf(cpf);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.delete(id);
  }
}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração do controller de pedidos para utilizar DTOs (CreateOrderDto e UpdateOrderDto)
// --------------------------------------------------------------
// Explicação da lógica:
// Controller responsável por gerenciar endpoints de pedidos. Agora utiliza DTOs
// para validação e tipagem dos dados recebidos ao criar e atualizar pedidos.
// by: gabbu (github: gabriellesote)
