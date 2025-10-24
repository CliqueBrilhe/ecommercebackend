// src/Modules/Review/dto/review-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty({ example: 1, description: 'ID da avaliação' })
  id: number;

  @ApiProperty({ example: 5, description: 'ID do usuário autor da avaliação' })
  userId: number;

  @ApiProperty({ example: 'Gabrielle Soares', description: 'Nome do usuário autor da avaliação' })
  userName: string;

  @ApiProperty({ example: 10, description: 'ID do produto avaliado' })
  productId: number;

  @ApiProperty({ example: 'Base Líquida Matte', description: 'Nome do produto avaliado' })
  productName: string;

  @ApiProperty({ example: 4, description: 'Nota atribuída ao produto (1 a 5)' })
  rating: number;

  @ApiProperty({
    example: 'Excelente qualidade, cobertura natural e duradoura.',
    description: 'Comentário do usuário sobre o produto',
  })
  comment?: string;

  @ApiProperty({
    example: '2025-10-26T03:59:00.000Z',
    description: 'Data de criação da avaliação',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-10-26T04:01:00.000Z',
    description: 'Data da última atualização da avaliação',
  })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 04:00
- Criado ReviewResponseDto para respostas seguras e documentadas
--------------------------------------------
Explicação da lógica:
Este DTO define a estrutura de resposta das avaliações de produtos no Swagger,
exibindo dados do usuário, produto, nota, comentário e datas de criação/atualização.
by: gabbu (github: gabriellesote) ✧
*/
