// src/Modules/Address/dto/create-address.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ description: 'Rua do endereço' })
  street: string;

  @ApiProperty({ description: 'Número do imóvel' })
  number: string;

  @ApiProperty({ description: 'Complemento do endereço', required: false })
  complement?: string;

  @ApiProperty({ description: 'Bairro do endereço' })
  neighborhood: string;

  @ApiProperty({ description: 'Cidade do endereço' })
  city: string;

  @ApiProperty({ description: 'Estado (UF) do endereço' })
  state: string;

  @ApiProperty({ description: 'CEP do endereço' })
  zipCode: string;

  @ApiProperty({ description: 'Define se é o endereço fiscal principal' })
  isMain: boolean;

  @ApiProperty({ description: 'ID do usuário associado' })
  userId: number;
}

/*
Histórico de alterações:
Edição: 23/10/2025 - 00:37
- Criação do DTO para criação de endereços
--------------------------------------------
Explicação da lógica:
DTO de criação de endereços contendo todos os campos
necessários para registro e vinculação ao usuário.
by: gabbu (github: gabriellesote) ✧
*/
