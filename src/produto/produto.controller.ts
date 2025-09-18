import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { Produto } from './produto.entity';

@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Post()
  create(@Body() produto: Produto) {
    return this.produtoService.create(produto);
  }

  @Get()
  findAll() {
    return this.produtoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.produtoService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() produto: Partial<Produto>) {
    return this.produtoService.update(id, produto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.produtoService.delete(id);
  }
}