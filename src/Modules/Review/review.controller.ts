// src/Modules/Review/review.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova avaliação' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'Avaliação criada com sucesso', type: Review })
  create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as avaliações' })
  @ApiResponse({ status: 200, description: 'Lista de avaliações', type: [Review] })
  findAll() {
    return this.reviewService.findAll();
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Busca avaliações por produto' })
  @ApiParam({ name: 'productId', type: Number })
  @ApiResponse({ status: 200, description: 'Avaliações do produto', type: [Review] })
  findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewService.findByProduct(productId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Busca avaliações por usuário' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'Avaliações do usuário', type: [Review] })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.reviewService.findByUser(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma avaliação' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({ status: 200, description: 'Avaliação atualizada', type: Review })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReviewDto) {
    return this.reviewService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma avaliação' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Avaliação removida com sucesso' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.delete(id);
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 03:25
- Criado controlador de avaliações com endpoints REST completos.
--------------------------------------------
Explicação da lógica:
Gerencia endpoints de avaliações de produtos, incluindo rotas
para listar, buscar, criar e excluir avaliações.
by: gabbu (github: gabriellesote)
*/
