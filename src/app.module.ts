import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoModule } from './produto/produto.module';
import { UsuarioModule } from './usuario/usuario.module';
import { PedidoModule } from './pedido/pedido.module';
import { Produto } from './produto/produto.entity';
import { Usuario } from './usuario/usuario.entity';
import { Pedido } from './pedido/pedido.entity';
import { PixModule } from './pix/pix.module'; // 👈 importar

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5433),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '2004habm',
      database: process.env.DB_NAME || 'ecommerce_local',
      entities: [Produto, Usuario, Pedido],
      synchronize: true,
    }),
    ProdutoModule,
    UsuarioModule,
    PedidoModule,
    PixModule, // 👈 adicionar aqui
  ],
})
export class AppModule {}