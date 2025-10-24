// src/Bling/usuario/usuario.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { blingSalesHttp } from '../Core/bling-http';

@Injectable()
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);

  /**
   * Busca contatos (usuários/clientes) do Bling com suporte à paginação.
   */
  async getUsers(page = 1) {
    try {
      const response = await blingSalesHttp.get('/contatos', {
        params: { pagina: page, criterio: 1 },
        headers: { Accept: 'application/json' },
      });

      const usuarios = response.data?.data ?? [];
      const hasNext = response.data?.hasNext ?? false;

      this.logger.log(
        `👥 Página ${page} carregada (${usuarios.length} usuários) | hasNext=${hasNext}`,
      );

      return { usuarios, hasNext };
    } catch (err: any) {
      this.logger.error(
        '❌ Erro ao buscar usuários:',
        err.response?.data || err.message,
      );
      return { usuarios: [], hasNext: false };
    }
  }

  /**
   * Busca um único usuário pelo ID no Bling.
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
🗓 24/10/2025 - 19:40
✨ Criação do UsuarioService.
--------------------------------------------
📘 Lógica:
- Responsável por se comunicar diretamente com a API de contatos do Bling.
- Fornece métodos GET com paginação e busca individual.
- Usa o token de VENDAS (blingSalesHttp).
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
