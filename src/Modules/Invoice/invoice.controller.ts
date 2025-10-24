// src/Modules/Invoice/invoice.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova nota fiscal' })
  @ApiBody({ type: CreateInvoiceDto })
  @ApiResponse({ status: 201, description: 'Nota criada com sucesso', type: Invoice })
  create(@Body() dto: CreateInvoiceDto) {
    return this.invoiceService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as notas fiscais' })
  @ApiResponse({ status: 200, description: 'Lista de notas', type: [Invoice] })
  findAll() {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma nota fiscal por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Nota encontrada', type: Invoice })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lista notas fiscais de um usuário' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'Notas fiscais encontradas', type: [Invoice] })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.invoiceService.findByUser(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza dados de uma nota fiscal' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateInvoiceDto })
  @ApiResponse({ status: 200, description: 'Nota atualizada com sucesso', type: Invoice })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInvoiceDto) {
    return this.invoiceService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma nota fiscal' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Nota removida com sucesso' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.delete(id);
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 02:50
- Criado controlador de notas fiscais completo.
--------------------------------------------
Explicação da lógica:
Controlador REST que expõe endpoints CRUD de notas fiscais,
integrando com pedidos e usuários, e documentado no Swagger.
by: gabbu (github: gabriellesote)
*/
