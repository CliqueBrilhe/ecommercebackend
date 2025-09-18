import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { Pedido } from './pedido.entity';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  async create(@Body() data: {
    produtoId: number;
    usuarioId: number;
    quantidade: number;
    valorFrete: number;
  }) {
    return this.pedidoService.create(data);
  }

  @Get()
  findAll() {
    return this.pedidoService.findAll();
  }

  @Get(':cpf')
  findOne(@Param('cpf') cpf: string) {
    return this.pedidoService.findByCpf(cpf);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateData: Partial<Pedido>) {
    return this.pedidoService.update(id, updateData);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.pedidoService.delete(id);
  }
}