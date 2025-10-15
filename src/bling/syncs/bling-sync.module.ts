// src/bling/syncs/bling-sync.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from 'src/produto/produto.entity';
import { Categoria } from 'src/categoria/categoria.entity';
import { BlingProdutosSyncService } from './bling-prudutos-sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, Categoria])],
  providers: [BlingProdutosSyncService],
  exports: [BlingProdutosSyncService],
})
export class BlingSyncModule {}
