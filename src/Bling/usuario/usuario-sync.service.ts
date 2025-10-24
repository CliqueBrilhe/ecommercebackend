// src/Bling/usuario/usuario-sync.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../../Modules/User/entities/user.entity';
import { UsuarioService } from './usuario.service';
import { styledLog } from '../../utils/log-style.util';
import { SyncResult } from '../core/types/sync-result.interface';

@Injectable()
export class UsuarioSyncService {
  constructor(
    private readonly usuarioService: UsuarioService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 🔄 Busca todas as páginas de usuários da API do Bling.
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
   * 🔁 Sincroniza todos os usuários (contatos) Bling → banco local.
   */
  async sincronizarUsuarios(): Promise<SyncResult> {
    styledLog('users', '🔄 Iniciando sincronização completa de usuários...', 'cyan');

    const usuariosBling = await this.fetchAllUsers();
    if (!Array.isArray(usuariosBling) || usuariosBling.length === 0) {
      styledLog('warning', '⚠️ Nenhum usuário encontrado na API do Bling.', 'brightYellow');
      return { createdCount: 0, updatedCount: 0 };
    }

    const usuariosLocais = await this.userRepository.find();
    let criados = 0, atualizados = 0, removidos = 0;

    for (const usuario of usuariosBling) {
      const { id, nome, numeroDocumento, email, telefone, celular, situacao } = usuario;

      const status = (situacao === 'A' ? 'active' : 'inactive') as UserStatus;

      const base: Partial<User> = {
        blingId: Number(id),
        name: nome,
        cpf: numeroDocumento,
        email,
        phone: telefone || celular,
        status,
        synchronized: true,
      };

      const existente = await this.userRepository.findOne({ where: { blingId: Number(id) } });

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

    // 🚨 Remove contatos que não existem mais no Bling
    for (const local of usuariosLocais) {
      const existe = usuariosBling.some((u) => Number(u.id) === Number(local.blingId));
      if (!existe) {
        await this.userRepository.delete({ id: local.id });
        removidos++;
        styledLog('users', `🗑️ Usuário removido: ${local.name}`, 'red');
      }
    }

    styledLog(
      'users',
      `✅ Sincronização concluída: ${criados} criados | ${atualizados} atualizados | ${removidos} removidos.`,
      'brightGreen',
    );

    return { createdCount: criados, updatedCount: atualizados };
  }

  /**
   * 📩 Cria ou atualiza um usuário individual (via webhook).
   */
  async upsertFromWebhook(data: any) {
    const { id, nome, numeroDocumento, email, telefone, celular, situacao } = data;
    const status = (situacao === 'A' ? 'active' : 'inactive') as UserStatus;

    const base: Partial<User> = {
      blingId: Number(id),
      name: nome,
      cpf: numeroDocumento,
      email,
      phone: telefone || celular,
      status,
      synchronized: true,
    };

    const existente = await this.userRepository.findOne({ where: { blingId: Number(id) } });
    if (existente) {
      Object.assign(existente, base);
      await this.userRepository.save(existente);
      styledLog('users', `♻️ Usuário atualizado via webhook: ${nome}`, 'green');
      return { result: 'updated' };
    }

    const novo = this.userRepository.create(base);
    await this.userRepository.save(novo);
    styledLog('users', `🆕 Usuário criado via webhook: ${nome}`, 'brightGreen');
    return { result: 'created' };
  }

  /**
   * 🗑️ Remove usuário pelo BlingID (via webhook).
   */
  async removeByBlingId(blingId: number) {
    await this.userRepository.delete({ blingId });
    styledLog('users', `🗑️ Usuário removido via webhook (BlingID=${blingId})`, 'red');
  }
}

/*
🗓 25/10/2025 - 00:50
✅ Correção: conversão segura do enum UserStatus + compatibilidade DeepPartial<User>
--------------------------------------------
📘 Lógica:
- Corrigido erro de tipagem ao criar/atualizar usuários.
- Campo `document` → `cpf` conforme entity real.
- Adicionada flag `synchronized`.
by: gabbu (github: gabriellesote) ✧
*/
