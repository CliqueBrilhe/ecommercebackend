// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProdutoModule } from './produto/produto.module';
import { UsuarioModule } from './usuario/usuario.module';
import { PedidoModule } from './pedido/pedido.module';
import { PixModule } from './pix/pix.module';
import { ImagemModule } from './imagens/imagem.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    // Lê variáveis do .env uma vez e disponibiliza globalmente
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexão com o Postgres (ajuste se precisar)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'ecommerce_local',
      autoLoadEntities: true,   // carrega entidades dos módulos automaticamente
      synchronize: true,        // use false em produção
      // Se você já usa DATABASE_URL, pode trocar por:
      // url: process.env.DATABASE_URL,
    }),

    // Módulos da aplicação
    ProdutoModule,
    UsuarioModule,
    PedidoModule,
    PixModule,
    ImagemModule,

    // Módulo de e-mail (já provê o EmailService)
    EmailModule,
  ],
  // Não precisa providers aqui para EmailService, ele já é provido pelo EmailModule
})
export class AppModule {}
