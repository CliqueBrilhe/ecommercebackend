// src/Modules/Auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../User/user.service';
import { User } from '../User/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valida credenciais de login por e-mail e senha.
   * Retorna o usuário sem o campo de senha em caso de sucesso.
   */
  async validateUser(email: string, password: string): Promise<User> {
    // Busca por e-mail
    const user = await this.usersService['userRepo'].findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciais inválidas.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciais inválidas.');

    return user;
  }

  /**
   * Gera token JWT para o usuário autenticado.
   */
  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.userType,
      status: user.status,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    // Retorna dados essenciais do usuário (sem senha)
    const { password, ...safeUser } = user as any;

    return {
      access_token: accessToken,
      user: safeUser,
    };
  }
}

/*
Histórico de alterações:
Edição: 25/10/2025 - 02:10
- Criação do AuthService com validação por e-mail/senha e emissão de JWT
--------------------------------------------
Explicação da lógica:
AuthService valida credenciais (bcrypt.compare) e, em caso de sucesso, emite um
JWT contendo identificadores do usuário (sub, email, role, status). Retorna o
token e os dados do usuário sem expor a senha.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
