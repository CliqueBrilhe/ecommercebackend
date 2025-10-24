// src/Modules/Review/entities/review.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../User/entities/user.entity';
import { Product } from '../../Product/entities/product.entity';

@Entity({ name: 'reviews' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  @Column({ type: 'int', default: 5 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

/*
Histórico de alterações:
Edição: 26/10/2025 - 04:00
- Removidos todos os decorators do Swagger (@ApiProperty)
--------------------------------------------
Explicação da lógica:
A entidade Review representa as avaliações de produtos feitas pelos usuários,
armazenando nota, comentário, e relacionamentos com usuário e produto.
by: gabbu (github: gabriellesote) ✧
*/
