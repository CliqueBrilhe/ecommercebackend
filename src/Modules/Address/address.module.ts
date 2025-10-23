// src/Modules/Address/address.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}

/*
Histórico de alterações:
Edição: 23/10/2025 - 00:25
- Criação do módulo Address e configuração do TypeORM
--------------------------------------------
Explicação da lógica:
O módulo Address registra a entidade Address no TypeORM,
fornecendo o serviço e o controller para operações CRUD.
O serviço também é exportado para ser usado em outros módulos,
como User e Order.
by: gabbu (github: gabriellesote) ✧
*/
