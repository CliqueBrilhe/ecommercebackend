// src/Modules/Review/dto/update-review.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}

/*
Histórico de alterações:
Edição: 26/10/2025 - 03:10
- Criado DTO para atualização de avaliações de produtos.
--------------------------------------------
Explicação da lógica:
Permite atualização parcial de avaliações (nota ou comentário),
sem exigir reenviar IDs de produto ou usuário.
by: gabbu (github: gabriellesote)
*/
