// src/Modules/Invoice/dto/create-invoice.dto.ts
import { IsInt, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({ description: 'ID do pedido associado à nota fiscal' })
  @IsInt({ message: 'O ID do pedido deve ser um número inteiro' })
  orderId: number;

  @ApiProperty({ description: 'ID do usuário (cliente) associado à nota fiscal' })
  @IsInt({ message: 'O ID do usuário deve ser um número inteiro' })
  userId: number;

  @ApiPropertyOptional({ description: 'Número da nota fiscal (NFe/NFCe)' })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiPropertyOptional({ description: 'Série da nota fiscal' })
  @IsOptional()
  @IsString()
  serie?: string;

  @ApiPropertyOptional({ description: 'Chave de acesso da nota fiscal' })
  @IsOptional()
  @IsString()
  accessKey?: string;

  @ApiPropertyOptional({
    description: 'Status atual da nota fiscal',
    enum: ['authorized', 'cancelled', 'denied', 'pending', 'error'],
    default: 'pending',
  })
  @IsOptional()
  @IsEnum(['authorized', 'cancelled', 'denied', 'pending', 'error'])
  status?: 'authorized' | 'cancelled' | 'denied' | 'pending' | 'error';

  @ApiPropertyOptional({ description: 'URL do XML da nota fiscal' })
  @IsOptional()
  @IsString()
  xmlUrl?: string;

  @ApiPropertyOptional({ description: 'URL do PDF/DANFE da nota fiscal' })
  @IsOptional()
  @IsString()
  pdfUrl?: string;

  @ApiPropertyOptional({ description: 'Data de emissão da nota fiscal', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  issuedAt?: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 02:35
- Criado DTO para criação de notas fiscais (Invoice).
--------------------------------------------
Explicação da lógica:
DTO usado na criação de notas fiscais, permitindo registro manual ou
automático via integração com o Bling ERP.
by: gabbu (github: gabriellesote)
*/
