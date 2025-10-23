// src/Modules/Address/address.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(dto: CreateAddressDto): Promise<Address> {
    const address = this.addressRepository.create(dto);
    return await this.addressRepository.save(address);
  }

  async findAll(): Promise<Address[]> {
    return await this.addressRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id }, relations: ['user'] });
    if (!address) throw new NotFoundException(`Endereço ID ${id} não encontrado`);
    return address;
  }

  async update(id: number, dto: UpdateAddressDto): Promise<Address> {
    const address = await this.findOne(id);
    Object.assign(address, dto);
    return await this.addressRepository.save(address);
  }

  async remove(id: number): Promise<void> {
    const address = await this.findOne(id);
    await this.addressRepository.remove(address);
  }
}

/*
Histórico de alterações:
Edição: 23/10/2025 - 00:29
- Criação do serviço Address com operações CRUD
--------------------------------------------
Explicação da lógica:
O serviço Address fornece as operações principais de
criação, leitura, atualização e exclusão de endereços.
Utiliza o repositório TypeORM e mantém o relacionamento
com o usuário (user) via chave estrangeira.
by: gabbu (github: gabriellesote) ✧
*/
