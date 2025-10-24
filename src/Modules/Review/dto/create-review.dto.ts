// src/Modules/Review/dto/create-review.dto.ts
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'ID do usuário que fez a avaliação' })
  @IsInt({ message: 'O ID do usuário deve ser um número inteiro.' })
  userId: number;

  @ApiProperty({ description: 'ID do produto avaliado' })
  @IsInt({ message: 'O ID do produto deve ser um número inteiro.' })
  productId: number;

  @ApiProperty({ description: 'Nota atribuída ao produto (1 a 5)', example: 5 })
  @IsInt({ message: 'A nota deve ser um número inteiro.' })
  @Min(1, { message: 'A nota mínima é 1.' })
  @Max(5, { message: 'A nota máxima é 5.' })
  rating: number;

  @ApiPropertyOptional({ description: 'Comentário opcional sobre o produto' })
  @IsOptional()
  @IsString({ message: 'O comentário deve ser uma string.' })
  comment?: string;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 03:10
- Criado DTO para criação de avaliações de produtos.
--------------------------------------------
Explicação da lógica:
DTO responsável por validar os dados de uma nova avaliação,
garantindo que a nota e os IDs de produto/usuário sejam válidos.
by: gabbu (github: gabriellesote)
*/
