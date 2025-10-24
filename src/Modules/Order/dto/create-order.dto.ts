// src/Modules/Order/dto/create-order.dto.ts
import {
  IsInt,
  IsNumber,
  IsArray,
  ValidateNested,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ description: 'ID do produto a ser adicionado ao pedido' })
  @IsInt({ message: 'O ID do produto deve ser um número inteiro.' })
  productId: number;

  @ApiProperty({ description: 'Quantidade do produto', example: 2 })
  @IsInt({ message: 'A quantidade deve ser um número inteiro.' })
  @Min(1, { message: 'A quantidade deve ser pelo menos 1.' })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'ID do usuário que realiza o pedido' })
  @IsInt({ message: 'O ID do usuário deve ser um número inteiro.' })
  userId: number;

  @ApiProperty({
    description: 'Lista de itens que compõem o pedido',
    type: [OrderItemDto],
  })
  @IsArray({ message: 'Os itens do pedido devem ser enviados em um array.' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Valor do frete',
    example: 19.9,
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'O valor do frete deve ser um número.' })
  shippingCost?: number;

  @ApiProperty({
    description: 'Desconto aplicado no pedido',
    example: 10.0,
    default: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'O desconto deve ser um número.' })
  discount?: number;
}

/*
Histórico de alterações:
Edição: 24/10/2025 - 23:05
- Reestruturado para suportar múltiplos itens (OrderItemDto[])
- Adicionados campos opcionais de frete (shippingCost) e desconto
- Removidos campos obsoletos (productId, quantity únicos)
- Tipagem e validações alinhadas ao novo OrderService e entidade Order
--------------------------------------------
Explicação da lógica:
DTO responsável por validar e estruturar os dados de criação de pedidos.
Agora o pedido pode conter vários produtos (itens), cada um com ID e quantidade.
Inclui valores opcionais de frete e desconto. O total é calculado automaticamente
no service. Usa validações aninhadas com class-validator e Swagger para documentação.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
