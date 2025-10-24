// src/Modules/Invoice/invoice.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { Invoice } from './entities/invoice.entity';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova nota fiscal' })
  @ApiBody({ type: CreateInvoiceDto })
  @ApiResponse({
    status: 201,
    description: 'Nota criada com sucesso',
    type: InvoiceResponseDto,
  })
  async create(@Body() dto: CreateInvoiceDto): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceService.create(dto);
    return this.mapToResponse(invoice);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as notas fiscais' })
  @ApiResponse({
    status: 200,
    description: 'Lista de notas',
    type: [InvoiceResponseDto],
  })
  async findAll(): Promise<InvoiceResponseDto[]> {
    const invoices = await this.invoiceService.findAll();
    return invoices.map((i) => this.mapToResponse(i));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma nota fiscal por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Nota encontrada',
    type: InvoiceResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<InvoiceResponseDto> {
    const invoice = await this.invoiceService.findOne(id);
    return this.mapToResponse(invoice);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Lista notas fiscais de um usuário' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Notas fiscais encontradas',
    type: [InvoiceResponseDto],
  })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<InvoiceResponseDto[]> {
    const invoices = await this.invoiceService.findByUser(userId);
    return invoices.map((i) => this.mapToResponse(i));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza dados de uma nota fiscal' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateInvoiceDto })
  @ApiResponse({
    status: 200,
    description: 'Nota atualizada com sucesso',
    type: InvoiceResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    const updated = await this.invoiceService.update(id, dto);
    return this.mapToResponse(updated);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma nota fiscal' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Nota removida com sucesso' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.invoiceService.delete(id);
  }

  // 🔄 Mapeador seguro: Entity → Response DTO
  private mapToResponse(invoice: Invoice): InvoiceResponseDto {
    return {
      id: invoice.id,
      blingId: invoice.blingId,
      orderId: (invoice as any).order?.id ?? null,
      userId: (invoice as any).user?.id ?? null,
      number: invoice.number,
      serie: invoice.serie,
      accessKey: invoice.accessKey,
      status: invoice.status,
      xmlUrl: invoice.xmlUrl,
      pdfUrl: invoice.pdfUrl,
      issuedAt: invoice.issuedAt,
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    };
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 02:55
- Substituído Invoice por InvoiceResponseDto no Swagger
- Adicionado mapToResponse() para conversão de entity → DTO
--------------------------------------------
Explicação da lógica:
O InvoiceController mantém toda a lógica original de CRUD, mas agora retorna
dados documentados via InvoiceResponseDto, garantindo respostas limpas,
sem dependências circulares e com melhor compatibilidade no Swagger.
by: gabbu (github: gabriellesote) ✧
*/
