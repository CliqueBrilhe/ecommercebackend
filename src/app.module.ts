// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

// 🧠 Núcleo do Bling (Core + EventEmitter + Cron + Webhook)
import { CoreBlingModule } from './Bling/core/core-bling.module';

// 🛍️ Catálogo (Produtos + Categorias)
import { CatalogoModule } from './Bling/catalogo/catalogo.module';

// 👥 Usuários (Contatos / Clientes)
import { UsuarioModule } from './Bling/usuario/usuario.module';

// 💼 Módulos do domínio da aplicação
import { AuthModule } from './Modules/Auth/auth.module';
import { UserModule } from './Modules/User/user.module';
import { AddressModule } from './Modules/Address/address.module';
import { OrderModule } from './Modules/Order/order.module';
import { PaymentModule } from './Modules/Payment/payment.module';
import { CartModule } from './Modules/Cart/cart.module';
import { InvoiceModule } from './Modules/Invoice/invoice.module';
import { WishlistModule } from './Modules/Wishlist/wishlist.module';
import { ProductModule } from './Modules/Product/product.module';
import { CategoryModule } from './Modules/Category/category.module';
import { ReviewModule } from './Modules/Review/review.module';

/**
 * 🧩 Função de configuração dinâmica do TypeORM
 */
const getOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  return {
    type: 'postgres',
    url: isProduction
      ? configService.get<string>('PROD_DB_URL') || ''
      : configService.get<string>('DEV_DB_URL') || '',
    ssl: isProduction
      ? { rejectUnauthorized: false } // Produção: SSL ativo
      : false, // Desenvolvimento: sem SSL
    autoLoadEntities: true,
    synchronize: !isProduction, // Apenas em dev
  };
};

@Module({
  imports: [
    // 🌎 Configurações globais
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),

    // 🗄️ Banco de dados
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getOrmConfig,
    }),

    // ⚙️ Núcleo do Bling e seus submódulos
    CoreBlingModule,
    CatalogoModule,
    UsuarioModule,

    // 🧱 Módulos da aplicação principal
    AuthModule,
    UserModule,
    AddressModule,
    OrderModule,
    PaymentModule,
    CartModule,
    ReviewModule,
    InvoiceModule,
    WishlistModule,
    ProductModule,
    CategoryModule,
  ],
})
export class AppModule {}

/*
🗓 25/10/2025 - 02:40
♻️ Refatoração: integração da nova arquitetura modular do Bling.
--------------------------------------------
📘 Lógica:
- Substituído o antigo BlingModule pelo CoreBlingModule, CatalogoModule e UsuarioModule.
- Mantida a configuração dinâmica do TypeORM.
- Estrutura modular escalável (pronta para adicionar VendaModule futuramente).
by: gabbu (github: gabriellesote) ✧
*/
