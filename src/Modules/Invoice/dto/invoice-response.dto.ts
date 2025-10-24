// src/Modules/Invoice/dto/invoice-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class InvoiceResponseDto {
  @ApiProperty({ example: 1, description: 'ID interno da nota fiscal' })
  id: number;

  @ApiProperty({
    example: 123456,
    description: 'ID da nota fiscal no Bling ERP',
    required: false,
  })
  blingId?: number;

  @ApiProperty({
    example: 10,
    description: 'ID do pedido associado à nota fiscal',
  })
  orderId: number;

  @ApiProperty({
    example: 5,
    description: 'ID do usuário associado à nota fiscal',
  })
  userId: number;

  @ApiProperty({
    example: '000123',
    description: 'Número da nota fiscal (NFe/NFCe)',
  })
  number?: string;

  @ApiProperty({
    example: '1',
    description: 'Série da nota fiscal',
  })
  serie?: string;

  @ApiProperty({
    example: '35241123456789000123550010000012341123456789',
    description: 'Chave de acesso da nota fiscal eletrônica',
  })
  accessKey?: string;

  @ApiProperty({
    example: 'authorized',
    enum: ['authorized', 'cancelled', 'denied', 'pending', 'error'],
    description: 'Status atual da nota fiscal',
  })
  status: 'authorized' | 'cancelled' | 'denied' | 'pending' | 'error';

  @ApiProperty({
    example: 'https://bling.com/files/xml/nota-123.xml',
    description: 'URL do arquivo XML da nota fiscal',
  })
  xmlUrl?: string;

  @ApiProperty({
    example: 'https://bling.com/files/pdf/nota-123.pdf',
    description: 'URL do PDF/DANFE da nota fiscal',
  })
  pdfUrl?: string;

  @ApiProperty({
    example: '2025-10-26T00:00:00.000Z',
    description: 'Data e hora da emissão da nota fiscal',
  })
  issuedAt?: Date;

  @ApiProperty({
    example: '2025-10-25T23:50:00.000Z',
    description: 'Data de criação do registro da nota fiscal',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-10-26T01:10:00.000Z',
    description: 'Data da última atualização do registro da nota fiscal',
  })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 02:10
- Criado InvoiceResponseDto para documentação e resposta de endpoints
--------------------------------------------
Explicação da lógica:
O InvoiceResponseDto é usado para exibir dados da nota fiscal no Swagger
sem dependências complexas. Inclui informações essenciais do documento fiscal,
como número, chave de acesso, status e URLs para XML e PDF.
by: gabbu (github: gabriellesote) ✧
*/
