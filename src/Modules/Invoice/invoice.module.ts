// src/Modules/Invoice/invoice.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Order } from '../Order/entities/order.entity';
import { User } from '../User/entities/user.entity';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Order, User])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}

/*
Histórico de alterações:
Edição: 26/10/2025 - 02:50
- Criação do módulo InvoiceModule com repositórios registrados.
--------------------------------------------
Explicação da lógica:
Centraliza a lógica de notas fiscais, exportando o serviço para uso
em outros módulos, como Order ou Payment.
by: gabbu (github: gabriellesote)
*/
