import { Controller, Post, Body } from '@nestjs/common';
import { PixService } from './pix.service';

@Controller('pix')
export class PixController {
  constructor(private readonly pixService: PixService) {}

  @Post()
  async gerarPix(@Body() body: { amount: number; customer: any }) {
    return this.pixService.criarPagamento(body.amount, body.customer);
  }
}