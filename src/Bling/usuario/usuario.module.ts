// src/Bling/usuario/usuario.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../Modules/User/entities/user.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioSyncService } from './usuario-sync.service';
import { UsuarioController } from './usuario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsuarioController],
  providers: [UsuarioService, UsuarioSyncService],
  exports: [UsuarioService, UsuarioSyncService],
})
export class UsuarioModule {}

/*
🗓 24/10/2025 - 20:05
🏗️ Estruturação do módulo de Usuário (Contatos do Bling).
--------------------------------------------
📘 Lógica:
- Agrupa serviços, controller e repositório de usuários.
- Expõe serviços para o Core (scheduler e outros módulos).
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
