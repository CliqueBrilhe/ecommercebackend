// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { BlingModule } from './Bling/bling.module';

import { AuthModule } from 'Modules/Auth/auth.module';

import { ProductModule } from './Modules/Product/product.module';
import { CategoryModule } from './Modules/Category/category.module';
import { UserModule } from './Modules/User/user.module';
import { OrderModule } from './Modules/Order/order.module';
import { BlingSyncModule } from 'Bling/sync/bling-sync.module';

/**
 * Função para obter a configuração do TypeORM baseada no ambiente.
 * @param configService O serviço de configuração para acessar variáveis de ambiente.
 * @returns A configuração do TypeOrmModuleOptions.
 */
const getOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  return {
    type: 'postgres',
    url: isProduction
      ? configService.get<string>('PROD_DB_URL') || ''
      : configService.get<string>('DEV_DB_URL') || '',
    ssl: isProduction
      ? { rejectUnauthorized: false } // produção: SSL ativo
      : false, // desenvolvimento: sem SSL
    autoLoadEntities: true,
    synchronize: !isProduction, // sincroniza schema só em dev
    // logging: !isProduction,
  };
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getOrmConfig,
    }),

    BlingModule,
    ProductModule,
    CategoryModule,
    UserModule,
    OrderModule,
    BlingSyncModule,
    AuthModule,
  ],
})
export class AppModule {}

// --------------------------------------------------------------
// Histórico de alterações:
// Edição: 16/10/2025
// Alterada a lógica do TypeORM para usar PostgreSQL tanto em desenvolvimento quanto em produção.
// URLs diferentes para dev (banco pessoal) e prod (banco de trabalho).
// synchronize e SSL configurados de acordo com o ambiente.
// --------------------------------------------------------------
// Explicação da lógica:
// A função getOrmConfig agora seleciona dinamicamente a URL do banco de dados com base em NODE_ENV.
// Em desenvolvimento, usa seu banco pessoal com synchronize ativo e sem SSL.
// Em produção, usa a URL do trabalho com SSL e synchronize desativado.
// by: gabbu (github: gabriellesote)
