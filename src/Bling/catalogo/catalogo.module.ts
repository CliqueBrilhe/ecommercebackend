// src/Bling/catalogo/catalogo.module.ts
import { Module } from '@nestjs/common';
import { CategoriaModule } from './categorias/categoria.module';
import { ProdutoModule } from './produtos/produto.module';

@Module({
  imports: [
    CategoriaModule, // 🔹 Sincronização e API de categorias
    ProdutoModule,   // 🔹 Sincronização e API de produtos
  ],
  exports: [
    CategoriaModule,
    ProdutoModule,
  ],
})
export class CatalogoModule {}

/*
🗓 24/10/2025 - 18:55
🏗️ Criação do módulo agregador CatalogoModule.
--------------------------------------------
📘 Lógica:
- Agrupa todos os submódulos de domínio do catálogo (produtos e categorias).
- Facilita a importação única no CoreBlingModule.
- Mantém o catálogo do Bling modular, escalável e desacoplado.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
