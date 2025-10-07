import { Controller, Get, Post, Put,Patch, Delete, Body, Param } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { Pedido, type StatusPedido} from './pedido.entity';

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


  //  07/10/2025 - by: gabbu

   // NOVO ENDPOINT: Rota para atualizar o status (usando PATCH)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: StatusPedido, // Espera o campo 'status' no Body
  ) {
    // Adicionamos uma validação básica para garantir que o 'status' foi enviado
    if (!status) {
        throw new Error('O novo status deve ser fornecido no corpo da requisição.');
    }
    return this.pedidoService.updateStatus(id, status);
  }

}