// src/Modules/Address/dto/address-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AddressResponseDto {
  @ApiProperty({ example: 1, description: 'ID do endereço' })
  id: number;

  @ApiProperty({ example: 'Rua das Flores', description: 'Logradouro do endereço' })
  street: string;

  @ApiProperty({ example: '123', description: 'Número do imóvel' })
  number: string;

  @ApiProperty({
    example: 'Apto 202, Bloco B',
    description: 'Complemento do endereço (opcional)',
    required: false,
  })
  complement?: string;

  @ApiProperty({ example: 'Centro', description: 'Bairro do endereço' })
  neighborhood: string;

  @ApiProperty({ example: 'Belo Horizonte', description: 'Cidade do endereço' })
  city: string;

  @ApiProperty({ example: 'MG', description: 'Estado (UF)' })
  state: string;

  @ApiProperty({ example: '30140-000', description: 'CEP do endereço' })
  zipCode: string;

  @ApiProperty({
    example: true,
    description: 'Define se este é o endereço fiscal principal do usuário',
  })
  isMain: boolean;

  @ApiProperty({
    example: 123456,
    description: 'Identificador do endereço no Bling ERP',
    required: false,
  })
  blingId?: number;

  @ApiProperty({ example: false, description: 'Status de sincronização com o Bling' })
  synchronized: boolean;

  @ApiProperty({ example: 12, description: 'ID do usuário associado ao endereço' })
  userId: number;

  @ApiProperty({
    example: 'Gabrielle Soares',
    description: 'Nome do usuário associado ao endereço',
  })
  userName: string;

  @ApiProperty({
    example: '2025-10-26T04:45:00.000Z',
    description: 'Data de criação do endereço',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-10-26T04:46:00.000Z',
    description: 'Data da última atualização do endereço',
  })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 04:45
- Criado AddressResponseDto para respostas seguras e documentadas no Swagger
--------------------------------------------
Explicação da lógica:
O DTO define a estrutura de resposta do endereço, exibindo apenas informações seguras
e evitando loops de relacionamento com o usuário.
by: gabbu (github: gabriellesote) ✧
*/
