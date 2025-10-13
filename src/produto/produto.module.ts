import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProdutoService } from './produto.service';
import { ProdutoController } from './produto.controller';
import { Produto } from './produto.entity';
import { Categoria } from 'src/categoria/categoria.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module'; 

@Module({
  imports: [TypeOrmModule.forFeature([Produto, Categoria]), CloudinaryModule], // <-- aqui
  controllers: [ProdutoController],
  providers: [ProdutoService],
})
export class ProdutoModule {}