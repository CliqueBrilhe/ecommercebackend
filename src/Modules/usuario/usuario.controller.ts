import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() usuario: Usuario) {
    return this.usuarioService.create(usuario);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('cpf') cpf:string) {
    return this.usuarioService.findOne(cpf);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() usuario: Partial<Usuario>) {
    return this.usuarioService.update(id, usuario);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.usuarioService.delete(id);
  }
}