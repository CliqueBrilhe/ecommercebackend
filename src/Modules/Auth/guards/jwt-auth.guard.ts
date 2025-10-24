// src/Modules/Auth/guards/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

/*
Histórico de alterações:
Edição: 25/10/2025 - 02:10
- Criação do JwtAuthGuard reusável para proteger rotas com JWT
--------------------------------------------
Explicação da lógica:
Wrapper do AuthGuard('jwt') para facilitar o uso de guardas nas rotas
protegidas. Se o token for inválido/ausente, a requisição é negada.
by: gabbu (github: gabriellesote) ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧
*/
