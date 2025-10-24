// src/Modules/User/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule], // 👈 permite uso em outros módulos (ex: AuthModule, OrderModule)
})
export class UserModule {}

/*
Histórico de alterações:
Edição: 25/10/2025 - 01:45
- Atualizado para exportar UserService e TypeOrmModule (para uso em autenticação e integração com pedidos)
--------------------------------------------
Explicação da lógica:
O módulo User agrupa toda a lógica relacionada a usuários: entidade, controller e serviço.
Agora exporta o serviço e o repositório para permitir integração com módulos de autenticação,
pedidos e sincronização Bling ERP.
by: gabbu (github: gabriellesote) ✧
*/
