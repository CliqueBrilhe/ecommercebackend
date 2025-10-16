// src/Modules/User/user.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: User })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários', type: [User] })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':cpf')
  @ApiOperation({ summary: 'Busca usuário pelo CPF' })
  @ApiParam({ name: 'cpf', type: String })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: User })
  findOne(@Param('cpf') cpf: string) {
    return this.userService.findOne(cpf);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um usuário por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso', type: User })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um usuário por ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}

/*
Histórico de alterações:
Edição: 15/10/2025
- Refatoração do UsuarioController para UserController, padronizando nomes e implementando DTOs
Edição: 16/10/2025
- Adicionados decorators do Swagger (@ApiTags, @ApiOperation, @ApiResponse, @ApiParam, @ApiBody) para documentação de todos os endpoints
--------------------------------------------
Explicação da lógica:
Controlador gerencia as rotas de usuários. As operações de CRUD agora usam DTOs para validação e os nomes dos endpoints e classes foram padronizados para inglês.
by: gabbu (github: gabriellesote)
*/
