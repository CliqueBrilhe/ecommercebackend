// src/Modules/Category/category.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CategoryResponseDto } from './dto/category-response.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova categoria' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
    type: CategoryResponseDto,
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.create(createCategoryDto);
    return this.mapToResponse(category);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as categorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias',
    type: [CategoryResponseDto],
  })
  async findAll() {
    const categories = await this.categoryService.findAll();
    return categories.map((c) => this.mapToResponse(c));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca categoria por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada',
    type: CategoryResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.findOne(id);
    return this.mapToResponse(category);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma categoria por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
    type: CategoryResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const updated = await this.categoryService.update(id, updateCategoryDto);
    return this.mapToResponse(updated);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma categoria por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Categoria removida com sucesso' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }

  // 🔄 Mapeador: transforma entity → DTO documental
  private mapToResponse(category: any): CategoryResponseDto {
    return {
      id: category.id,
      blingId: category.blingId,
      name: category.name,
      path: category.path,
      order: category.order,
      parentId: category.parent?.id ?? null,
      childrenIds: category.children?.map((child) => child.id) ?? [],
      productNames: category.products?.map((p) => p.name) ?? [],
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 01:50
- Substituído tipo Category por CategoryResponseDto no Swagger
- Adicionado mapToResponse() para conversão segura de entity → DTO
--------------------------------------------
Explicação da lógica:
O CategoryController mantém toda a lógica original de CRUD e seed,
mas agora documenta as respostas via CategoryResponseDto, garantindo
um Swagger limpo e livre de dependências circulares.
by: gabbu (github: gabriellesote) ✧
*/
