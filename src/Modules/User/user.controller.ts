// src/user/user.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':cpf')
  findOne(@Param('cpf') cpf: string) {
    return this.userService.findOne(cpf);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração do UsuarioController para UserController, padronizando nomes e implementando DTOs
// --------------------------------------------------------------
// Explicação da lógica:
// Controlador gerencia as rotas de usuários. As operações de CRUD agora usam DTOs para validação e os nomes dos endpoints e classes foram padronizados para inglês.
// by: gabbu (github: gabriellesote)
