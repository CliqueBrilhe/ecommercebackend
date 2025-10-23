// src/Modules/Address/dto/update-address.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}

/*
Histórico de alterações:
Edição: 23/10/2025 - 00:38
- Criação do DTO de atualização baseado no CreateAddressDto
--------------------------------------------
Explicação da lógica:
Utiliza o PartialType do Swagger/NestJS para permitir
atualizações parciais nos registros de endereço.
by: gabbu (github: gabriellesote) ✧
*/
