// src/Modules/Auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Autentica o usuário e retorna um JWT' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Retorna o usuário autenticado (self)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    return req.user; // payload injetado pelo JwtStrategy
  }
}

/*
Histórico de alterações:
Edição: 25/10/2025 - 02:10
- Criação do AuthController com endpoints /auth/login e /auth/me
--------------------------------------------
Explicação da lógica:
Controller expõe endpoints públicos e protegidos; /login valida credenciais
e devolve JWT; /me usa guard de JWT para retornar o payload do usuário autenticado.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
