// src/Modules/Invoice/dto/update-invoice.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateInvoiceDto } from './create-invoice.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';

export class UpdateInvoiceDto extends PartialType(CreateInvoiceDto) {
  @ApiPropertyOptional({
    description: 'Status atualizado da nota fiscal',
    enum: ['authorized', 'cancelled', 'denied', 'pending', 'error'],
  })
  @IsOptional()
  @IsEnum(['authorized', 'cancelled', 'denied', 'pending', 'error'])
  status?: 'authorized' | 'cancelled' | 'denied' | 'pending' | 'error';
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 02:35
- Criado DTO para atualização parcial de notas fiscais.
--------------------------------------------
Explicação da lógica:
Permite atualização de status e dados fiscais da nota, usado
tanto em atualizações manuais quanto automáticas via Bling.
by: gabbu (github: gabriellesote)
*/
