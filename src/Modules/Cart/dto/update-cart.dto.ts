// src/Modules/Cart/dto/update-cart.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateCartDto } from './create-cart.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @ApiPropertyOptional({
    description: 'Status do carrinho (active, converted, abandoned)',
    enum: ['active', 'converted', 'abandoned'],
    example: 'active',
  })
  @IsOptional()
  @IsEnum(['active', 'converted', 'abandoned'])
  status?: 'active' | 'converted' | 'abandoned';
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 02:05
- Criado DTO de atualização de carrinho com campo de status.
--------------------------------------------
Explicação da lógica:
DTO utilizado para atualizações parciais do carrinho, permitindo
mudança de status ou modificação dos itens existentes.
by: gabbu (github: gabriellesote)
*/
