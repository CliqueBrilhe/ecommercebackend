// src/Modules/Cart/cart.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../Product/entities/product.entity';
import { User } from '../User/entities/user.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product, User])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}

/*
Histórico de alterações:
Edição: 26/10/2025 - 02:15
- Criação do módulo CartModule com repositórios registrados.
--------------------------------------------
Explicação da lógica:
O módulo de carrinhos centraliza as dependências e provê o CartService
para uso em outros módulos, como Order e Checkout.
by: gabbu (github: gabriellesote)
*/
