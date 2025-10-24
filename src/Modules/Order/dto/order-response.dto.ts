import { ApiProperty } from '@nestjs/swagger';
import type { OrderStatus } from '../entities/order.entity';

export class OrderResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 12345 })
  blingId?: number;

  @ApiProperty({ example: 'pending', enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] })
  status: OrderStatus;

  @ApiProperty({ example: 200.5 })
  totalAmount: number;

  @ApiProperty({ example: 20.0 })
  shippingCost: number;

  @ApiProperty({ example: 0.0 })
  discount: number;

  @ApiProperty({ example: false })
  synchronized: boolean;

  @ApiProperty({ example: '2025-10-23T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-10-23T11:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ example: 2 })
  userId: number; // você pode retornar o ID do user, sem expandir o objeto

  @ApiProperty({ type: [Number], example: [10, 11] })
  paymentIds?: number[]; // lista dos pagamentos (sem expandir o objeto inteiro)
}
