// src/Bling/bling.module.ts

import { Module } from '@nestjs/common';
import { CoreBlingModule } from './core/bling.module';
import { CatalogoModule } from './catalogo/catalogo.module';
import { UsuarioModule } from './usuario/usuario.module';
import { VendaModule } from './venda/venda.module';

/**
 * 🌐 Módulo principal de integração com o Bling ERP.
 * Atua como orquestrador dos submódulos (Core, Catálogo, Usuário, Venda).
 */
@Module({
  imports: [
    CoreBlingModule, // 🧠 Núcleo: webhook global, scheduler e logs
    CatalogoModule,  // 🛍️ Produtos e categorias
    UsuarioModule,   // 👥 Contatos/clientes
    VendaModule,     // 💳 Pedidos de venda e faturamento
  ],
})
export class BlingModule {}

/*
🗓 24/10/2025 - 21:00
♻️ Refatoração completa: BlingModule agora é o orquestrador global.
--------------------------------------------
📘 Lógica:
- O módulo central (`BlingModule`) agora importa todos os módulos do ecossistema Bling:
  • `CoreBlingModule`: contém o webhook mundial, scheduler e logs automáticos.
  • `CatalogoModule`: cuida da sincronização de produtos e categorias.
  • `UsuarioModule`: sincroniza contatos/clientes da API de vendas.
  • `VendaModule`: integrará pedidos e faturas (futuro).
- A arquitetura modular permite expansões futuras (ex: Estoques, Notas Fiscais).
- Mantém o código desacoplado e reutilizável entre domínios.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
