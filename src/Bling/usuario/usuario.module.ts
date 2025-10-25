// src/Bling/usuario/usuario.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../Modules/User/entities/user.entity';
import { UsuarioService } from './usuario.service';
import { UsuarioSyncService } from './usuario-sync.service';
import { UsuarioPushService } from './usuario-push.service';
import { UsuarioController } from './usuario.controller';
import { UsuarioListener } from './usuario.listener';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    UsuarioSyncService,
    UsuarioPushService,
    UsuarioListener,
  ],
  exports: [UsuarioService, UsuarioSyncService, UsuarioPushService],
})
export class UsuarioModule {}
