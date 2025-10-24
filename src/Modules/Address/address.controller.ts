// src/Modules/Address/address.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { AddressResponseDto } from './dto/address-response.dto';

@ApiTags('Addresses')
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo endereço' })
  @ApiBody({ type: CreateAddressDto })
  @ApiResponse({
    status: 201,
    description: 'Endereço criado com sucesso',
    type: AddressResponseDto,
  })
  async create(@Body() dto: CreateAddressDto): Promise<AddressResponseDto> {
    const address = await this.addressService.create(dto);
    return this.mapToResponse(address);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os endereços' })
  @ApiResponse({
    status: 200,
    description: 'Lista de endereços cadastrados',
    type: [AddressResponseDto],
  })
  async findAll(): Promise<AddressResponseDto[]> {
    const addresses = await this.addressService.findAll();
    return addresses.map((a) => this.mapToResponse(a));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um endereço pelo ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Endereço encontrado com sucesso',
    type: AddressResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<AddressResponseDto> {
    const address = await this.addressService.findOne(id);
    return this.mapToResponse(address);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um endereço existente' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateAddressDto })
  @ApiResponse({
    status: 200,
    description: 'Endereço atualizado com sucesso',
    type: AddressResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAddressDto,
  ): Promise<AddressResponseDto> {
    const updated = await this.addressService.update(id, dto);
    return this.mapToResponse(updated);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um endereço' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Endereço removido com sucesso',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.remove(id);
  }

  // 🔄 Conversão segura Entity → DTO documental
  private mapToResponse(address: Address): AddressResponseDto {
    return {
      id: address.id,
      street: address.street,
      number: address.number,
      complement: address.complement,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      isMain: address.isMain,
      blingId: address.blingId,
      synchronized: address.synchronized,
      userId: (address as any).user?.id ?? null,
      userName: (address as any).user?.name ?? '',
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    };
  }
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 04:45
- Atualizado controller para usar AddressResponseDto
- Adicionado mapToResponse() para conversão segura entity → DTO
--------------------------------------------
Explicação da lógica:
O AddressController mantém o comportamento REST original, mas agora documenta e retorna
respostas seguras com AddressResponseDto, eliminando dependências circulares e garantindo
contratos de resposta consistentes no Swagger.
by: gabbu (github: gabriellesote) ✧
*/
