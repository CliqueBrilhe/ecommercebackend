// src/Bling/usuario/usuario.controller.ts
import { Controller, Get, Post } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioSyncService } from './usuario-sync.service';
import { styledLog } from '../../utils/log-style.util';

@Controller('bling/usuarios')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly usuarioSync: UsuarioSyncService,
  ) {}

  @Get()
  async listarUsuariosDireto() {
    styledLog('users', '🔍 Testando comunicação com API do Bling (contatos)...', 'cyan');
    return this.usuarioService.getUsers();
  }

  @Post('sync')
  async sincronizarUsuarios() {
    styledLog('users', '🚀 Sincronização manual de usuários iniciada...', 'brightCyan');
    return this.usuarioSync.sincronizarUsuarios();
  }
}

/*
🗓 24/10/2025 - 20:00
✨ Criação do UsuarioController.
--------------------------------------------
📘 Lógica:
- GET /bling/usuarios → Testa comunicação direta com a API do Bling.
- POST /bling/usuarios/sync → Sincroniza contatos Bling → DB local.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
