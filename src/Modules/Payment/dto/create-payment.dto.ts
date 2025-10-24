// src/Modules/Payment/dto/create-payment.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsEnum,
  IsString,
  IsDateString,
} from 'class-validator';
import type { PaymentStatus } from '../entities/payment.entity';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID do usuário que realiza o pagamento' })
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'ID do pedido associado' })
  @IsInt()
  orderId: number;

  @ApiProperty({ description: 'ID do método de pagamento selecionado' })
  @IsInt()
  paymentMethodId: number;

  @ApiProperty({ description: 'Valor total do pagamento' })
  @IsNumber({}, { message: 'O valor do pagamento deve ser numérico.' })
  amount: number;

  @ApiProperty({
    description: 'Status inicial do pagamento',
    enum: ['pending', 'approved', 'refused', 'refunded', 'cancelled'],
    default: 'pending',
  })
  @IsOptional()
  @IsEnum(['pending', 'approved', 'refused', 'refunded', 'cancelled'])
  status?: PaymentStatus;

  @ApiProperty({
    description: 'Identificador da transação no gateway (ex: Mercado Pago)',
    required: false,
  })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiProperty({
    description: 'Link de pagamento (PIX, boleto, etc.)',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentLink?: string;

  @ApiProperty({
    description: 'Data de confirmação do pagamento (opcional)',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  paidAt?: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 00:45
- Criação do DTO de criação de pagamentos (CreatePaymentDto)
--------------------------------------------
Explicação da lógica:
DTO usado para validar e documentar os dados de criação de um pagamento.
Inclui IDs relacionais e informações opcionais de gateway (link, transação, data).
by: gabbu (github: gabriellesote) ✧
*/
