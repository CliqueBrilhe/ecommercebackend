// src/bling/core/bling.controller.ts
import { Controller, Get } from '@nestjs/common';
import { BlingService } from './bling.service';


@Controller('bling')
export class BlingController {
  constructor(
    private readonly blingService: BlingService,
  ) {}

  // Endpoint para testar a comunicação direta com a API da Bling
  @Get('produtos')
  async getProdutosDireto() {
    return this.blingService.getProducts();
  }

}

/*
🗓 16/10/2025
🔧 Refatoração: padronização de rotas e injeção de dependências conforme nova estrutura modular 
--------------------------------------------
📘 Lógica:
Controlador principal da integração com a API da Bling.
Expõe endpoints para:
- Obter produtos diretamente da API do Bling (`/bling/produtos`);

by: gabbu (github: gabriellesote)
*/

