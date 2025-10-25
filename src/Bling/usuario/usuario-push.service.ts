// src/Bling/usuario/usuario-push.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { blingSalesHttp } from '../core/bling-http';
import { User } from '../../Modules/User/entities/user.entity';
import { styledLog } from '../../utils/log-style.util';

@Injectable()
export class UsuarioPushService {
  private readonly logger = new Logger(UsuarioPushService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 🔼 Envia um usuário local para o Bling (criação ou atualização).
   * - Se o usuário não tem `blingId`, cria.
   * - Se já tem, atualiza.
   */
  async pushUser(user: User) {
    try {
      const payload = this.mapToBlingFormat(user);

      if (!user.blingId) {
        // 🔹 Criação
        const response = await blingSalesHttp.post('/contatos', payload);
        const createdId = response.data?.data?.id;

        if (createdId) {
          await this.userRepository.update(user.id, {
            blingId: Number(createdId),
            synchronized: true,
          });
          styledLog(
            'users',
            `🆕 Usuário criado no Bling: ${user.name} (ID=${createdId})`,
            'brightGreen',
          );
        }
        return response.data;
      } else {
        // 🔹 Atualização
        await blingSalesHttp.put(`/contatos/${user.blingId}`, payload);
        await this.userRepository.update(user.id, { synchronized: true });
        styledLog(
          'users',
          `♻️ Usuário atualizado no Bling: ${user.name} (ID=${user.blingId})`,
          'green',
        );
      }
    } catch (error: any) {
      this.logger.error(
        `❌ Erro ao enviar usuário para o Bling: ${user.name}`,
        error.response?.data || error.message,
      );
      throw error;
    }
  }

  /**
   * 🧩 Converte um usuário local no formato esperado pela API do Bling.
   */
  private mapToBlingFormat(user: User) {
    return {
      nome: user.name,
      numeroDocumento: user.cpf,
      email: user.email,
      fone: user.phone,
      situacao: user.status === 'active' ? 'A' : 'I',
      tipoPessoa: 'F', // F = pessoa física
      contribuinte: 9,  // 9 = consumidor final
    };
  }
}

/*
🗓 25/10/2025 - 01:20
✨ Novo serviço de push de usuários → Bling.
--------------------------------------------
📘 Lógica:
- Cria ou atualiza contatos no Bling.
- Atualiza blingId e synchronized no banco local.
- Usa mapeamento direto User → Bling API.
by: gabbu (github: gabriellesote) ✧
*/
