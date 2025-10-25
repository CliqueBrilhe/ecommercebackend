// src/Bling/catalogo/catalogo.module.ts
import { Module } from '@nestjs/common';
import { CategoriaModule } from './categorias/categoria.module';
import { ProdutoModule } from './produtos/produto.module';

/**
 * 🧩 Módulo Catálogo do Bling
 * Centraliza os módulos de categorias e produtos.
 * Exporta ambos para uso pelo Core (sincronização automática, etc.).
 */
@Module({
  imports: [CategoriaModule, ProdutoModule],
  exports: [CategoriaModule, ProdutoModule],
})
export class CatalogoModule {}

/*
🗓 25/10/2025 - 13:40
♻️ Correção: removida exportação direta de services (apenas reexporta módulos filhos).
--------------------------------------------
📘 Lógica:
- O Nest só permite exportar providers declarados no próprio módulo.
- Como CategoriaSyncService e ProdutoSyncService estão em módulos filhos,
  basta exportar CategoriaModule e ProdutoModule.
by: gabbu (github: gabriellesote) ✧
*/
