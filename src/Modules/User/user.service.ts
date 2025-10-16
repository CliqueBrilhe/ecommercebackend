// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  async findOne(cpf: string) {
    const user = await this.userRepo.findOneBy({ cpf });
    if (!user) throw new NotFoundException(`User with CPF ${cpf} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.preload({
      id,
      ...updateUserDto,
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return this.userRepo.save(user);
  }

  async delete(id: number) {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`User with ID ${id} not found`);
  }
}

// --------------------------------------------------------------
// Edição: 15/10/2025
// Refatoração do UsuarioService para UserService, implementando DTOs e padronizando nomes
// --------------------------------------------------------------
// Explicação da lógica:
// Serviço de usuários agora utiliza DTOs para validação na criação e atualização. Todas as operações CRUD foram padronizadas para nomes em inglês e incluem tratamento de erros.
// by: gabbu (github: gabriellesote)
