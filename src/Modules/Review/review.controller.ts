// src/Modules/Review/review.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Review } from './entities/review.entity';
import { ReviewResponseDto } from './dto/review-response.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova avaliação' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({
    status: 201,
    description: 'Avaliação criada com sucesso',
    type: ReviewResponseDto,
  })
  async create(@Body() dto: CreateReviewDto): Promise<ReviewResponseDto> {
    const review = await this.reviewService.create(dto);
    return this.mapToResponse(review);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as avaliações' })
  @ApiResponse({
    status: 200,
    description: 'Lista de avaliações',
    type: [ReviewResponseDto],
  })
  async findAll(): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewService.findAll();
    return reviews.map((r) => this.mapToResponse(r));
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Busca avaliações por produto' })
  @ApiParam({ name: 'productId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Avaliações do produto',
    type: [ReviewResponseDto],
  })
  async findByProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewService.findByProduct(productId);
    return reviews.map((r) => this.mapToResponse(r));
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Busca avaliações por usuário' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Avaliações do usuário',
    type: [ReviewResponseDto],
  })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewService.findByUser(userId);
    return reviews.map((r) => this.mapToResponse(r));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma avaliação' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({
    status: 200,
    description: 'Avaliação atualizada com sucesso',
    type: ReviewResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    const updated = await this.reviewService.update(id, dto);
    return this.mapToResponse(updated);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma avaliação' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Avaliação removida com sucesso' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.delete(id);
  }

  // 🔄 Conversão segura: Entity → DTO
  private mapToResponse(review: Review): ReviewResponseDto {
    return {
      id: review.id,
      userId: (review as any).user?.id ?? null,
      userName: (review as any).user?.name ?? '',
      productId: (review as any).product?.id ?? null,
      productName: (review as any).product?.name ?? '',
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 04:00
- Substituído tipo Review por ReviewResponseDto no Swagger
- Adicionado mapToResponse() para conversão segura entity → DTO
--------------------------------------------
Explicação da lógica:
O ReviewController mantém os endpoints originais de CRUD,
mas retorna dados documentados com ReviewResponseDto, eliminando dependências circulares
e tornando o Swagger mais limpo e previsível.
by: gabbu (github: gabriellesote) ✧
*/
