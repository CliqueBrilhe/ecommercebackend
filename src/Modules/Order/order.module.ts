// src/Modules/Order/order.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../Product/entities/product.entity';
import { User } from '../User/entities/user.entity';
import { AuthModule } from '../Auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Product, User]),
    AuthModule, // 👈 permite proteger rotas de pedidos com JWT
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}

/*
Histórico de alterações:
Edição: 26/10/2025 - 00:15
- Adicionado OrderItem ao módulo e integração com AuthModule
--------------------------------------------
Explicação da lógica:
O OrderModule agrupa toda a lógica de criação e gestão de pedidos,
registrando repositórios e injetando dependências de Product e User.
Agora importa AuthModule para rotas autenticadas.
by: gabbu (github: gabriellesote) ✧
*/
