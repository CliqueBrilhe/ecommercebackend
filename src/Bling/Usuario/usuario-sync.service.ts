// src/Bling/usuario/usuario-sync.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../Modules/User/entities/user.entity';
import { UsuarioService } from './usuario.service';
import { styledLog } from '../../utils/log-style.util';
import { SyncResult } from '../core/types/sync-result.interface';

@Injectable()
export class UsuarioSyncService {
  private readonly logger = new Logger(UsuarioSyncService.name);

  constructor(
    private readonly usuarioService: UsuarioService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Busca todas as páginas de usuários do Bling.
   */
  private async fetchAllUsers(): Promise<any[]> {
    let page = 1;
    let all: any[] = [];
    let hasNext = true;

    while (hasNext) {
      const { usuarios, hasNext: next } = await this.usuarioService.getUsers(page);
      all = [...all, ...usuarios];
      hasNext = next;
      page++;
      if (hasNext) await new Promise((r) => setTimeout(r, 300));
    }

    styledLog('users', `📦 Total de usuários obtidos: ${all.length}`, 'cyan');
    return all;
  }

  /**
   * Sincroniza usuários Bling → banco local.
   */
  async sincronizarUsuarios(): Promise<SyncResult> {
    styledLog('users', '🔄 Iniciando sincronização de usuários...', 'cyan');

    const usuariosBling = await this.fetchAllUsers();
    if (!Array.isArray(usuariosBling) || usuariosBling.length === 0) {
      styledLog('warning', '⚠️ Nenhum usuário encontrado na API do Bling.', 'brightYellow');
      return { createdCount: 0, updatedCount: 0 };
    }

    const usuariosLocais = await this.userRepository.find();
    let criados = 0, atualizados = 0;

    for (const usuario of usuariosBling) {
      const { id, nome, numeroDocumento, email, telefone, celular, situacao } = usuario;
      const status = situacao === 'A' ? 'active' : 'inactive';

      const base = {
        blingId: Number(id),
        name: nome,
        document: numeroDocumento,
        email,
        phone: telefone || celular,
        status,
      };

      const existente = await this.userRepository.findOne({
        where: { blingId: Number(id) },
      });

      if (existente) {
        Object.assign(existente, base);
        await this.userRepository.save(existente);
        atualizados++;
        styledLog('users', `♻️ Usuário atualizado: ${nome}`, 'green');
      } else {
        const novo = this.userRepository.create(base);
        await this.userRepository.save(novo);
        criados++;
        styledLog('users', `🆕 Usuário criado: ${nome}`, 'brightGreen');
      }
    }

    styledLog('users', `✅ Sync concluída: ${criados} criados | ${atualizados} atualizados.`, 'brightGreen');
    return { createdCount: criados, updatedCount: atualizados };
  }
}

/*
🗓 24/10/2025 - 19:50
✅ Criação do UsuarioSyncService.
--------------------------------------------
📘 Lógica:
- Sincroniza todos os contatos do Bling com o banco local.
- Cria ou atualiza registros conforme o BlingID.
- Usa logs padronizados e ciclo simples de atualização.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
