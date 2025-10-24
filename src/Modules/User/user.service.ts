// src/Modules/User/user.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Cria um novo usuário com senha criptografada.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { cpf, email, password } = createUserDto;

    // Evita duplicidade de CPF e e-mail
    const existingUser = await this.userRepo.findOne({
      where: [{ cpf }, { email }],
    });
    if (existingUser)
      throw new BadRequestException('CPF ou e-mail já cadastrados.');

    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword,
      synchronized: false,
    });

    return await this.userRepo.save(user);
  }

  /**
   * Retorna todos os usuários, com relações principais.
   */
  async findAll(): Promise<User[]> {
    return this.userRepo.find({
      relations: ['addresses', 'orders', 'payments'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Busca usuário por CPF, incluindo relações principais.
   */
  async findOneByCpf(cpf: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { cpf },
      relations: ['addresses', 'orders', 'payments', 'wishlistItems', 'reviews'],
    });
    if (!user) throw new NotFoundException(`Usuário com CPF ${cpf} não encontrado.`);
    return user;
  }

  /**
   * Atualiza informações do usuário (sem alterar senha diretamente).
   */
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);

    Object.assign(user, updateUserDto);
    return await this.userRepo.save(user);
  }

  /**
   * Remove usuário por ID.
   */
  async delete(id: number): Promise<void> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
  }
}

/*
Histórico de alterações:
Edição: 25/10/2025 - 01:10
- Atualizado para refletir novo modelo User com sincronização e relacionamentos
- Adicionada criptografia de senha (bcrypt)
- Implementadas validações de duplicidade de CPF e e-mail
- Inclusas relações em findAll e findOneByCpf
--------------------------------------------
Explicação da lógica:
O UserService gerencia o ciclo de vida dos usuários no sistema.
Valida duplicidades, criptografa senhas e mantém o status de sincronização com o Bling ERP.
Inclui listagem com relações e tratamento de erros padronizado para CRUD completo.
by: gabbu (github: gabriellesote) ✧
*/
