import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  create(usuario: Usuario) {
    return this.usuarioRepo.save(usuario);
  }

  findAll() {
    return this.usuarioRepo.find();
  }

  findOne(cpf: string) {
    return this.usuarioRepo.findOneBy({ cpf });
  }

  update(id: number, usuario: Partial<Usuario>) {
    return this.usuarioRepo.update(id, usuario);
  }

  delete(id: number) {
    return this.usuarioRepo.delete(id);
  }
}