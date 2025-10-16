// src/order/dto/create-order.dto.ts
import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateOrderDto {
  @IsInt({ message: 'O ID do produto deve ser um número inteiro.' })
  productId: number;

  @IsInt({ message: 'O ID do usuário deve ser um número inteiro.' })
  userId: number;

  @IsInt({ message: 'A quantidade deve ser um número inteiro.' })
  @Min(1, { message: 'A quantidade deve ser pelo menos 1.' })
  quantity: number;

  @IsNumber({}, { message: 'O valor do frete deve ser um número.' })
  shippingValue: number;
}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Criação do DTO para criação de pedidos (CreateOrderDto)
// --------------------------------------------------------------
// Explicação da lógica:
// DTO utilizado para validar e tipar os dados recebidos ao criar um pedido.
// Inclui IDs de produto e usuário, quantidade e valor do frete.
// by: gabbu (github: gabriellesote)
