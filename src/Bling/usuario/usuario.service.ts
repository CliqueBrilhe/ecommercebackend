// src/Bling/usuario/usuario.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { blingSalesHttp } from '../core/bling-http';

@Injectable()
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);

  /**
   * 👥 Busca contatos (usuários/clientes) do Bling com suporte à paginação.
   */
  async getUsers(page = 1) {
    try {
      const response = await blingSalesHttp.get('/contatos', {
        params: { pagina: page, criterio: 1 },
        headers: { Accept: 'application/json' },
      });

      const usuarios = response.data?.data ?? [];
      const hasNext = response.data?.hasNext ?? false;

      this.logger.log(`📄 Página ${page} carregada (${usuarios.length} usuários) | hasNext=${hasNext}`);
      return { usuarios, hasNext };
    } catch (err: any) {
      this.logger.error('❌ Erro ao buscar usuários:', err.response?.data || err.message);
      return { usuarios: [], hasNext: false };
    }
  }

  /**
   * 🔍 Busca um único usuário pelo ID no Bling.
   */
  async getUserById(id: number) {
    try {
      const response = await blingSalesHttp.get(`/contatos/${id}`);
      return response.data?.data;
    } catch (err: any) {
      this.logger.error(`❌ Erro ao buscar usuário ${id}:`, err.response?.data || err.message);
      return null;
    }
  }
}

/*
🗓 24/10/2025 - 23:30
✨ Melhoria: tipagem e logs uniformizados.
--------------------------------------------
📘 Lógica:
- Comunicação direta com API de contatos do Bling.
- Suporte à paginação e busca individual.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
