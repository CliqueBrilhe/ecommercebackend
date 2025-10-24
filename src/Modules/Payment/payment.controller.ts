// src/Modules/Payment/payment.controller.ts
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
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { JwtAuthGuard } from '../Auth/guards/jwt-auth.guard';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Cria um novo pagamento' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiResponse({
    status: 201,
    description: 'Pagamento criado com sucesso',
    type: Payment,
  })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Lista todos os pagamentos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagamentos',
    type: [Payment],
  })
  findAll() {
    return this.paymentService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('user/:userId')
  @ApiOperation({ summary: 'Lista pagamentos de um usuário' })
  @ApiParam({ name: 'userId', type: Number })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.paymentService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um pagamento por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePaymentDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.paymentService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um pagamento por ID' })
  @ApiParam({ name: 'id', type: Number })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.paymentService.delete(id);
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 00:45
- Criação do PaymentController com endpoints CRUD protegidos por JWT
--------------------------------------------
Explicação da lógica:
O controlador expõe endpoints autenticados para criação, listagem e
gerenciamento de pagamentos, integrando User, Order e PaymentMethod.
by: gabbu (github: gabriellesote) ✧
*/
