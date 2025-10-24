// src/Modules/Wishlist/wishlist.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistItem } from './entities/wishlist-item.entity';
import { User } from '../User/entities/user.entity';
import { Product } from '../Product/entities/product.entity';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistItem, User, Product])],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}

/*
Histórico de alterações:
Edição: 26/10/2025 - 04:00
- Criado módulo WishlistModule com repositórios configurados.
--------------------------------------------
Explicação da lógica:
Centraliza dependências e serviços da lista de desejos,
permitindo integração com o front e dashboards do usuário.
by: gabbu (github: gabriellesote)
*/
