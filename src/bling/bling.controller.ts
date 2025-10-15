// src/bling/bling.controller.ts
import { Controller, Get } from '@nestjs/common';
import { BlingService } from './bling.service';

@Controller('bling')
export class BlingController {
  constructor(private readonly blingService: BlingService) {}

  @Get('produtos')
  async getProdutos() {
    return this.blingService.getProducts();
  }
}



/*
  Controller 'BlingController':
  - Rota base: '/bling'
  - Endpoint '/bling/produtos': Quando acessado via GET, chama o serviço 'BlingService'
    que se conecta à API da Bling e retorna a lista de produtos.
  - A lógica é simples: o controller apenas delega a requisição ao service e retorna
    o resultado ao cliente (Postman, frontend ou qualquer outro consumidor da API).

  Date: 15/10/2025
  Edit by: Gabbu (gabriellesote)
*/