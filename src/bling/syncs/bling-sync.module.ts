// src/bling/syncs/bling-sync.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Produto } from 'src/produto/produto.entity';
import { Categoria } from 'src/categoria/categoria.entity';
import { BlingProdutosSyncService } from './bling-prudutos-sync.service';
import { BlingCategoriasSyncService } from './bling-categorias-sync.service';
import { SyncController } from './sync.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Produto, Categoria])],
  controllers: [SyncController],
  providers: [BlingProdutosSyncService, BlingCategoriasSyncService],
  exports: [BlingProdutosSyncService, BlingCategoriasSyncService],
})
export class BlingSyncModule {}
