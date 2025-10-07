import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProdutoModule } from './produto/produto.module';
import { UsuarioModule } from './usuario/usuario.module';
import { PedidoModule } from './pedido/pedido.module';
import { PixModule } from './pix/pix.module';
import { ImagemModule } from './imagens/imagem.module';
import { EmailModule } from './email/email.module';

// Variável para determinar o ambiente.
// O TypeORM usará PostgreSQL se NODE_ENV for 'production'.
const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    // Lê variáveis do .env uma vez e disponibiliza globalmente
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      // 1. Definição do Tipo de BD: 'postgres' ou 'sqlite'
      type: isProduction ? 'postgres' : 'sqlite',

      // 2. Configurações para PostgreSQL (Usadas APENAS em produção)
      // O TypeORM ignora estas chaves se o 'type' for 'sqlite'.
      host: isProduction ? process.env.DB_HOST || 'localhost' : undefined,
      port: isProduction ? Number(process.env.DB_PORT || 5432) : undefined,
      username: isProduction ? process.env.DB_USER || 'postgres' : undefined,
      password: isProduction ? process.env.DB_PASS || 'postgres' : undefined,
      
      // 3. Configuração do Nome/Caminho do Banco de Dados
      // Usa o nome do BD Postgres na nuvem, ou um arquivo local para o SQLite.
      database: isProduction 
        ? process.env.DB_NAME || 'ecommerce_local'
        : 'ecommerce_local_test.sqlite', // O arquivo SQLite será criado aqui!

      // 4. Opções de Conexão Comuns
      autoLoadEntities: true,   
      // IMPORTANTE: 'synchronize: true' é seguro APENAS em desenvolvimento com SQLite. 
      // Em produção (Postgres) ele será 'false', o que é uma boa prática.
      synchronize: !isProduction, 
    }),

    // Módulos da aplicação
    ProdutoModule,
    UsuarioModule,
    PedidoModule,
    PixModule,
    ImagemModule,

    // Módulo de e-mail
    EmailModule,
  ],
})
export class AppModule {}
