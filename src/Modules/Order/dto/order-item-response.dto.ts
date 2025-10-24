import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty({ example: 1, description: 'ID do item do pedido' })
  id: number;

  @ApiProperty({ example: 15, description: 'ID do pedido ao qual o item pertence' })
  orderId: number;

  @ApiProperty({ example: 8, description: 'ID do produto associado' })
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantidade do produto neste pedido' })
  quantity: number;

  @ApiProperty({ example: 49.9, description: 'Preço unitário do produto na compra' })
  price: number;

  @ApiProperty({ example: 99.8, description: 'Subtotal calculado (quantidade × preço)' })
  subtotal: number;
}

/*
Histórico de alterações:
Edição: 25/10/2025 - 00:45
- Criado DTO documental para exibição no Swagger
- Incluídos apenas campos primitivos (sem relações)
--------------------------------------------
Explicação da lógica:
O OrderItemResponseDto representa a versão segura e simplificada do item
de pedido exibida no Swagger. Evita dependências circulares ao expor apenas
os identificadores e valores primitivos, mantendo a documentação clara.
by: gabbu (github: gabriellesote) ✧
*/
