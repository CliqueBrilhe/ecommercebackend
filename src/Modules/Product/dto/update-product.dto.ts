// src/Modules/Product/dto/update-product.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({
    description: 'Status do produto (active, to_verify, inactive)',
    enum: ['active', 'to_verify', 'inactive'],
    example: 'active',
  })
  @IsOptional()
  @IsEnum(['active', 'to_verify', 'inactive'], {
    message: 'O status deve ser active, to_verify ou inactive',
  })
  status?: 'active' | 'to_verify' | 'inactive';

  @ApiPropertyOptional({
    description: 'Indica se o produto já foi sincronizado com o Bling ERP',
    default: false,
  })
  @IsOptional()
  synchronized?: boolean;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 01:50
- Criado DTO para atualização de produtos
- Adicionados campos opcionais de status e sincronização
--------------------------------------------
Explicação da lógica:
DTO usado para atualização parcial de produtos. Herda as validações do
CreateProductDto e adiciona campos internos opcionais (status e synchronized)
para controle de sincronização com o Bling.
by: gabbu (github: gabriellesote) ✧
*/
