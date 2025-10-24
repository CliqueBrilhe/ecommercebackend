// src/Modules/Review/review.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { User } from '../User/entities/user.entity';
import { Product } from '../Product/entities/product.entity';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Product])],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}

/*
Histórico de alterações:
Edição: 26/10/2025 - 03:25
- Criado módulo ReviewModule com dependências registradas.
--------------------------------------------
Explicação da lógica:
Centraliza toda a lógica de avaliações de produtos, exportando
o serviço para uso em relatórios ou dashboards futuros.
by: gabbu (github: gabriellesote)
*/
