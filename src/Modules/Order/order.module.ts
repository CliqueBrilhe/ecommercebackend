// src/order/order.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { Product } from '../Product/product.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, User]), // Registra os repositórios
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração de nomenclaturas para inglês (module e imports)
// --------------------------------------------------------------
// Explicação da lógica:
// Módulo que registra a entidade Order, seus relacionamentos com Product e User,
// além do controller e service responsáveis pelo gerenciamento de pedidos.
// by: gabbu (github: gabriellesote)
