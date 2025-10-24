// src/Modules/Review/entities/review.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../User/entities/user.entity';
import { Product } from '../../Product/entities/product.entity';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'ID interno da avaliação' })
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @ApiProperty({ description: 'Usuário que realizou a avaliação', type: () => User })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @ApiProperty({ description: 'Produto avaliado', type: () => Product })
  product: Product;

  @Column({ type: 'int', default: 5 })
  @ApiProperty({ description: 'Nota atribuída ao produto (1 a 5)', example: 5 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Comentário opcional do usuário sobre o produto' })
  comment?: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Data em que a avaliação foi criada' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Data da última atualização da avaliação' })
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 25/10/2025 - 00:20
- Criada entidade Review (avaliações de produtos)
- Relacionada a User e Product
--------------------------------------------
Explicação da lógica:
A entidade Review permite que usuários avaliem produtos após a compra.
Armazena a nota e o comentário do usuário, vinculados ao produto e ao autor.
by: gabbu (github: gabriellesote) ✧
*/
