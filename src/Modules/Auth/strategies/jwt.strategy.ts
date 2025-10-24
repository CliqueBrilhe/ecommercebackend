// src/Modules/Auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'dev-secret-change-me',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  /**
   * O retorno deste método é setado em req.user pelas rotas protegidas.
   */
  async validate(payload: any) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      status: payload.status,
    };
  }
}

/*
Histórico de alterações:
Edição: 25/10/2025 - 02:10
- Criação do JwtStrategy para extrair e validar o token Bearer
--------------------------------------------
Explicação da lógica:
Configura o Passport Strategy para JWT, lendo o token do header Authorization.
Em caso de token válido, injeta informações essenciais do usuário em req.user.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
