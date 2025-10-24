// src/Modules/Payment/dto/update-payment.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import type { PaymentStatus } from '../entities/payment.entity';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @ApiPropertyOptional({
    description: 'Atualiza o status do pagamento',
    enum: ['pending', 'approved', 'refused', 'refunded', 'cancelled'],
  })
  @IsOptional()
  @IsEnum(['pending', 'approved', 'refused', 'refunded', 'cancelled'])
  status?: PaymentStatus;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 00:45
- Criado DTO para atualização parcial de pagamentos
--------------------------------------------
Explicação da lógica:
Permite atualizar parcialmente os dados de um pagamento existente,
como status, link e informações do gateway.
by: gabbu (github: gabriellesote) ✧
*/
