// src/Modules/Address/address.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@ApiTags('Addresses')
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo endereço' })
  @ApiResponse({ status: 201, description: 'Endereço criado com sucesso', type: Address })
  create(@Body() dto: CreateAddressDto) {
    return this.addressService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os endereços' })
  findAll() {
    return this.addressService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um endereço pelo ID' })
  findOne(@Param('id') id: number) {
    return this.addressService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um endereço existente' })
  update(@Param('id') id: number, @Body() dto: UpdateAddressDto) {
    return this.addressService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um endereço' })
  remove(@Param('id') id: number) {
    return this.addressService.remove(id);
  }
}

/*
Histórico de alterações:
Edição: 23/10/2025 - 00:33
- Criação do controller Address com endpoints REST CRUD
--------------------------------------------
Explicação da lógica:
O controller Address expõe endpoints para manipulação
dos endereços cadastrados. Usa o serviço AddressService
para executar as operações de negócio. Documentado com
Swagger para integração e testes diretos.
by: gabbu (github: gabriellesote) ✧
*/
