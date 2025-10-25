// src/Bling/usuario/usuario.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioSyncService } from './usuario-sync.service';
import { UsuarioPushService } from './usuario-push.service';
import { styledLog } from '../../utils/log-style.util';
import { User } from '@user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('bling/usuarios')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly usuarioSync: UsuarioSyncService,
    private readonly usuarioPush: UsuarioPushService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @Get()
  async listarUsuariosDireto() {
    styledLog(
      'users',
      '🔍 Testando comunicação com API de contatos (usuários)...',
      'cyan',
    );
    return this.usuarioService.getUsers();
  }

  @Post('sync')
  async sincronizarUsuarios() {
    styledLog(
      'users',
      '🚀 Sincronização manual de usuários iniciada...',
      'brightCyan',
    );
    return this.usuarioSync.sincronizarUsuarios();
  }

  @Post('push/:id')
  async pushUsuario(@Param('id') id: number) {
    styledLog(
      'users',
      `📤 Iniciando envio do usuário ID=${id} para o Bling...`,
      'brightCyan',
    );

    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    const result = await this.usuarioPush.pushUser(user);

    styledLog(
      'users',
      `✅ Push concluído: ${user.name} → Bling (ID=${result?.data?.id ?? user.blingId})`,
      'brightGreen',
    );
    return { ok: true, blingId: result?.data?.id ?? user.blingId };
  }
}

/*
🗓 24/10/2025 - 23:30
✅ Controlador revisado e padronizado.
--------------------------------------------
📘 Lógica:
- GET: testa comunicação com API do Bling.
- POST /sync: executa sincronização manual.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
