// src/Modules/Order/order.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../Auth/guards/jwt-auth.guard';
import { OrderResponseDto } from './dto/order-response.dto'; // 👈 aqui entra o DTO documental

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cria um novo pedido para o usuário autenticado' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso',
    type: OrderResponseDto, // 👈 usamos o DTO aqui
  })
  async create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.id;
    const order = await this.orderService.create({ ...createOrderDto, userId });

    return {
      id: order.id,
      blingId: order.blingId,
      status: order.status,
      totalAmount: order.totalAmount,
      shippingCost: order.shippingCost,
      discount: order.discount,
      synchronized: order.synchronized,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      userId: order.user?.id,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista todos os pedidos (requer autenticação)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos',
    type: [OrderResponseDto], // 👈 aqui também
  })
  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderService.findAll();
    return orders.map((o) => ({
      id: o.id,
      blingId: o.blingId,
      status: o.status,
      totalAmount: o.totalAmount,
      shippingCost: o.shippingCost,
      discount: o.discount,
      synchronized: o.synchronized,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      userId: o.user?.id,
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista pedidos do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Pedidos encontrados',
    type: [OrderResponseDto], // 👈 substitui Order
  })
  async findMyOrders(@Req() req): Promise<OrderResponseDto[]> {
    const cpf = req.user.cpf;
    const orders = await this.orderService.findByCpf(cpf);
    return orders.map((o) => ({
      id: o.id,
      blingId: o.blingId,
      status: o.status,
      totalAmount: o.totalAmount,
      shippingCost: o.shippingCost,
      discount: o.discount,
      synchronized: o.synchronized,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      userId: o.user?.id,
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza um pedido por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Pedido atualizado com sucesso',
    type: OrderResponseDto, // 👈 ainda o DTO
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    const order = await this.orderService.update(id, updateOrderDto);
    return {
      id: order.id,
      blingId: order.blingId,
      status: order.status,
      totalAmount: order.totalAmount,
      shippingCost: order.shippingCost,
      discount: order.discount,
      synchronized: order.synchronized,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      userId: order.user?.id,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove um pedido por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Pedido removido com sucesso' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.delete(id);
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 00:40
- Substituídas referências diretas à entidade Order por OrderResponseDto no Swagger
- Adicionado mapeamento de retorno simplificado para o Swagger
--------------------------------------------
Explicação da lógica:
Usar o OrderResponseDto evita dependências circulares e garante que o Swagger
documente apenas dados primitivos e controlados. A lógica de negócio do controller
permanece intacta, apenas o contrato de resposta documentado foi ajustado.
by: gabbu (github: gabriellesote) ✧
*/
