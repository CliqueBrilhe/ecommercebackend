import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { Pedido } from './pedido.entity';
import { Produto } from '../Product/produto.entity';
import { Usuario } from '../usuario/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pedido, Produto, Usuario]), // <-- Registra os 3 repositórios
  ],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}