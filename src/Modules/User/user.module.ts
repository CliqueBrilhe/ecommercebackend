// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração do UsuarioModule para UserModule, padronizando nomes
// --------------------------------------------------------------
// Explicação da lógica:
// Módulo registra repositório, controlador e serviço para usuários, agora com nomenclatura padronizada em inglês.
// by: gabbu (github: gabriellesote)
