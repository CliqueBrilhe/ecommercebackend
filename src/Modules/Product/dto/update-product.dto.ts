// src/Modules/Product/dto/update-product.dto.ts
import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
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
