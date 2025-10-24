// src/Modules/Payment/payment.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import { User } from '../User/entities/user.entity';
import { Order } from '../Order/entities/order.entity';
import { AuthModule } from '../Auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentMethod, User, Order]),
    AuthModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}

/*
Histórico de alterações:
Edição: 26/10/2025 - 00:45
- Criação completa do módulo de pagamentos com repositórios e integração JWT
--------------------------------------------
Explicação da lógica:
O módulo Payment centraliza os serviços e controladores de pagamento,
registrando entidades e integrando autenticação JWT para operações seguras.
by: gabbu (github: gabriellesote) ✧
*/
