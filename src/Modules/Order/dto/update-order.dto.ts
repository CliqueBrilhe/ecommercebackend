// src/order/dto/update-order.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Criação do DTO para atualização de pedidos (UpdateOrderDto)
// --------------------------------------------------------------
// Explicação da lógica:
// DTO que torna todos os campos do CreateOrderDto opcionais, permitindo
// atualizações parciais de pedidos.
// by: gabbu (github: gabriellesote)
