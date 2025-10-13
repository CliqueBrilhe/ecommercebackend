// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ProdutoModule } from './produto/produto.module';
import { UsuarioModule } from './usuario/usuario.module';
import { PedidoModule } from './pedido/pedido.module';
import { PixModule } from './pix/pix.module';
import { ImagemModule } from './imagens/imagem.module';
import { EmailModule } from './email/email.module';
import { CategoriaModule } from './categoria/categoria.module';

/**
 * Função para obter a configuração do TypeORM baseada no ambiente.
 * @param configService O serviço de configuração para acessar variáveis de ambiente.
 * @returns A configuração do TypeOrmModuleOptions.
 */
const getOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  if (isProduction) {
    // Configuração para o ambiente de produção (PostgreSQL na Railway)
    // A Railway normalmente fornece a URL de conexão completa na variável DATABASE_URL.
    return {
      type: 'postgres',
      url: configService.get<string>('DATABASE_URL'),
      ssl: {
        // Esta configuração pode ser necessária para conexões com bancos de dados em nuvem.
        rejectUnauthorized: false,
      },
      autoLoadEntities: true,
      // 'synchronize' deve ser false em produção para evitar perda de dados.
      // Migrations devem ser usadas para atualizar o schema do banco de dados.
      synchronize: true,
    };
  } else {
    // Configuração para o ambiente de desenvolvimento (SQLite local)
    return {
      type: 'sqlite',
      // O banco de dados será um arquivo chamado 'db.sqlite' na raiz do projeto.
      database: 'db.sqlite',
      autoLoadEntities: true,
      // 'synchronize' é útil em desenvolvimento para criar o schema do banco automaticamente.
      synchronize: true,
    };
  }
};

@Module({
  imports: [
    // Lê variáveis do .env e as torna disponíveis globalmente.
    ConfigModule.forRoot({ isGlobal: true }),

    // Configuração dinâmica do TypeORM que escolhe o banco de dados
    // com base no ambiente (produção vs. desenvolvimento).
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getOrmConfig, // Usa a função auxiliar para obter a configuração correta.
    }),

    // Módulos da sua aplicação.
    ProdutoModule,
    UsuarioModule,
    PedidoModule,
    PixModule,
    ImagemModule,
    EmailModule,
    CategoriaModule
  ],
})
export class AppModule {}
