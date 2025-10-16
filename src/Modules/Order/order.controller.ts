//  src/Modules/Order/order.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo pedido' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso', type: Order })
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os pedidos' })
  @ApiResponse({ status: 200, description: 'Lista de pedidos', type: [Order] })
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Get(':cpf')
  @ApiOperation({ summary: 'Busca pedidos por CPF do usuário' })
  @ApiParam({ name: 'cpf', type: String })
  @ApiResponse({ status: 200, description: 'Pedidos encontrados', type: [Order] })
  findByCpf(@Param('cpf') cpf: string): Promise<Order[]> {
    return this.orderService.findByCpf(cpf);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um pedido por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({ status: 200, description: 'Pedido atualizado com sucesso', type: Order })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um pedido por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Pedido removido com sucesso' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.delete(id);
  }
}

/*
Histórico de alterações:
Edição: 15/10/2025
- Refatoração do controller de pedidos para utilizar DTOs (CreateOrderDto e UpdateOrderDto)
Edição: 16/10/2025
- Adicionados decorators do Swagger (@ApiTags, @ApiOperation, @ApiResponse, @ApiParam, @ApiBody) para documentação de todos os endpoints
--------------------------------------------
Explicação da lógica:
Controller responsável por gerenciar endpoints de pedidos. Agora utiliza DTOs
para validação e tipagem dos dados recebidos ao criar e atualizar pedidos.
by: gabbu (github: gabriellesote)
*/
