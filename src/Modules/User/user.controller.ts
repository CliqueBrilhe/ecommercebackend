// src/Modules/User/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../Auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 🧩 Criação de usuário
  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: User,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // 🧩 Listagem geral (apenas admin futuramente)
  @Get()
  @ApiOperation({ summary: 'Lista todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários cadastrados',
    type: [User],
  })
  findAll() {
    return this.userService.findAll();
  }

  // 🧩 Busca por CPF
  @Get(':cpf')
  @ApiOperation({ summary: 'Busca usuário pelo CPF' })
  @ApiParam({ name: 'cpf', type: String, description: 'CPF do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    type: User,
  })
  findByCpf(@Param('cpf') cpf: string) {
    return this.userService.findOneByCpf(cpf);
  }

  // 🧩 Retorna o usuário autenticado
  @UseGuards(JwtAuthGuard)
  @Get('me/profile')
  @ApiOperation({ summary: 'Retorna o perfil do usuário autenticado' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Dados do usuário autenticado',
    type: User,
  })
  getProfile(@Req() req: any) {
    return this.userService.findOneByCpf(req.user.email);
  }

  // 🧩 Atualização por ID
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um usuário por ID (somente autenticado)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: User,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // 🧩 Exclusão por ID
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove um usuário por ID (somente autenticado)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Usuário removido com sucesso',
  })
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}

/*
Histórico de alterações:
Edição: 25/10/2025 - 23:50
- Atualizado para usar UserService.findOneByCpf
- Adicionada rota protegida /users/me/profile via JwtAuthGuard
- Endpoints de update e delete agora requerem autenticação
- Padronização da documentação Swagger e import de AuthGuard
--------------------------------------------
Explicação da lógica:
O controller de usuários expõe as rotas de criação, listagem, busca, atualização e remoção.
Integra autenticação JWT para proteger ações sensíveis (perfil, atualização, exclusão).
A rota /users/me/profile usa o token JWT para identificar o usuário logado.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
