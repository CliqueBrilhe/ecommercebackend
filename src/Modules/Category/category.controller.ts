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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@ApiTags('Categories')
@Controller('categories') // Define a rota base para este controlador: /categories
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('seed')
  @ApiOperation({ summary: 'Seed do banco de categorias' })
  @ApiResponse({ status: 200, description: 'Banco de categorias populado' })
  seed() {
    return this.categoryService.seed();
  }

  @Post()
  @ApiOperation({ summary: 'Cria uma nova categoria' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso', type: Category })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todas as categorias' })
  @ApiResponse({ status: 200, description: 'Lista de categorias', type: [Category] })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca categoria por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Categoria encontrada', type: Category })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza uma categoria por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Categoria atualizada com sucesso', type: Category })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma categoria por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Categoria removida com sucesso' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}

/*
Histórico de alterações:
Edição: 15/10/2025
- Refatoração de nomenclaturas para inglês (controller, service, DTOs e rotas)
Edição: 16/10/2025
- Adicionados decorators do Swagger (@ApiTags, @ApiOperation, @ApiResponse, @ApiParam, @ApiBody) para documentação de todos os endpoints
--------------------------------------------
Explicação da lógica:
Este controller expõe endpoints HTTP para gerenciar categorias, incluindo seed do banco,
criação, listagem, busca por ID, atualização e remoção de categorias.
by: gabbu (github: gabriellesote)
*/
