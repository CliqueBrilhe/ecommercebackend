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
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../Auth/guards/jwt-auth.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // 🧩 Criação de pedido autenticada
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cria um novo pedido para o usuário autenticado' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso',
    type: Order,
  })
  async create(@Req() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.id; // vem do JWT
    return this.orderService.create({ ...createOrderDto, userId });
  }

  // 🧩 Listagem de todos os pedidos (restrita a admins futuramente)
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista todos os pedidos (requer autenticação)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos',
    type: [Order],
  })
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  // 🧩 Listagem de pedidos do usuário autenticado
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista pedidos do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Pedidos encontrados',
    type: [Order],
  })
  findMyOrders(@Req() req): Promise<Order[]> {
    const cpf = req.user.cpf;
    return this.orderService.findByCpf(cpf);
  }

  // 🧩 Atualização de pedido
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza um pedido por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Pedido atualizado com sucesso',
    type: Order,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  // 🧩 Exclusão de pedido
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove um pedido por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Pedido removido com sucesso',
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.delete(id);
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 00:15
- Adicionadas rotas protegidas com JwtAuthGuard
- Adicionada rota /orders/me para listar pedidos do usuário autenticado
- Ajustado método create para capturar userId via JWT
--------------------------------------------
Explicação da lógica:
O OrderController expõe endpoints CRUD para pedidos, com autenticação JWT.
O usuário autenticado pode criar e visualizar seus próprios pedidos,
enquanto a listagem geral será restrita a admins no futuro.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
