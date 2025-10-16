// src/order/dto/create-order.dto.ts
import { IsInt, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ description: 'ID do produto' })
  @IsInt({ message: 'O ID do produto deve ser um número inteiro.' })
  productId: number;

  @ApiProperty({ description: 'ID do usuário' })
  @IsInt({ message: 'O ID do usuário deve ser um número inteiro.' })
  userId: number;

  @ApiProperty({ description: 'Quantidade de produtos' })
  @IsInt({ message: 'A quantidade deve ser um número inteiro.' })
  @Min(1, { message: 'A quantidade deve ser pelo menos 1.' })
  quantity: number;

  @ApiProperty({ description: 'Valor do frete' })
  @IsNumber({}, { message: 'O valor do frete deve ser um número.' })
  shippingValue: number;
}

/*
Histórico de alterações:
Edição: 15/10/2025 - Criação do DTO para criação de pedidos (CreateOrderDto)
Edição: 16/10/2025 - Adicionados decorators do Swagger (@ApiProperty)
--------------------------------------------
Explicação da lógica:
DTO utilizado para validar e tipar os dados recebidos ao criar um pedido.
Inclui IDs de produto e usuário, quantidade e valor do frete, agora documentado no Swagger.
by: gabbu (github: gabriellesote)
*/
