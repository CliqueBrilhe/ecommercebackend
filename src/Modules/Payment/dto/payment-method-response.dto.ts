// src/Modules/Payment/dto/payment-method-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethodResponseDto {
  @ApiProperty({ example: 1, description: 'ID interno da forma de pagamento' })
  id: number;

  @ApiProperty({
    example: 3125,
    description: 'ID correspondente da forma de pagamento no Bling ERP',
  })
  blingId: number;

  @ApiProperty({
    example: 'PIX',
    description: 'Descrição da forma de pagamento (ex: PIX, Boleto, Cartão)',
  })
  description: string;

  @ApiProperty({
    example: 20,
    description:
      'Tipo fiscal de pagamento definido pelo Bling (ex: 20 = PIX, 15 = Boleto)',
  })
  paymentType: number;

  @ApiProperty({
    example: 1,
    description: 'Situação do método (1 = ativo, 0 = inativo)',
  })
  status: number;

  @ApiProperty({
    example: false,
    description: 'Indica se a forma é fixa (criada internamente no Bling)',
  })
  fixed: boolean;

  @ApiProperty({
    example: false,
    description: 'Indica se é o método padrão configurado no Bling',
  })
  defaultMethod: boolean;

  @ApiProperty({
    example: 2,
    description: 'Finalidade do método (ex: 2 = venda, 3 = compra)',
    required: false,
  })
  purpose?: number;

  @ApiProperty({
    example: 0,
    description: 'Percentual de juros padrão aplicado pelo método',
  })
  interest: number;

  @ApiProperty({
    example: 0,
    description: 'Percentual de multa padrão aplicado pelo método',
  })
  fine: number;

  @ApiProperty({
    example: '2025-10-26T01:00:00.000Z',
    description: 'Data de criação do registro no sistema',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-10-26T01:05:00.000Z',
    description: 'Data da última atualização do registro no sistema',
  })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 00:55
- Criado DTO documental para exibição no Swagger
- Incluídos apenas campos primitivos (sem relacionamentos)
--------------------------------------------
Explicação da lógica:
O PaymentMethodResponseDto representa a forma de pagamento no Swagger sem expor
relações com outras entidades. Ele é usado apenas para documentação, garantindo
que o Swagger não tente resolver dependências circulares.
by: gabbu (github: gabriellesote) ✧
*/
