import { ApiProperty } from '@nestjs/swagger';
import type { PaymentStatus } from '../entities/payment.entity';

export class PaymentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 123 })
  blingId?: number;

  @ApiProperty({ example: 199.9 })
  amount: number;

  @ApiProperty({ enum: ['pending', 'approved', 'refused', 'refunded', 'cancelled'], example: 'approved' })
  status: PaymentStatus;

  @ApiProperty({ example: 'MP-9981TX' })
  transactionId?: string;

  @ApiProperty({ example: 'https://pagamento.com/checkout/abc' })
  paymentLink?: string;

  @ApiProperty({ example: '2025-10-23T12:00:00.000Z' })
  paidAt?: Date;

  @ApiProperty({ example: '2025-10-23T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-23T11:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: 5 })
  userId: number;

  @ApiProperty({ example: 42 })
  orderId: number;

  @ApiProperty({ example: 3 })
  paymentMethodId: number;
}
