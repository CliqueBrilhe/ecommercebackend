// src/Bling/sync/entities/sync-log.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'sync_log' })
export class SyncLog {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'ID do registro de log de sincronização',
    example: 1,
  })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({
    description: 'Tipo da sincronização (manual ou automática)',
    example: 'automatic',
    enum: ['manual', 'automatic'],
  })
  type: 'manual' | 'automatic';

  @Column({ type: 'varchar', length: 50 })
  @ApiProperty({
    description:
      'Módulo sincronizado (produtos, categorias, usuários ou vendas)',
    example: 'products',
    enum: ['products', 'categories', 'users', 'sales'],
  })
  module: 'products' | 'categories' | 'users' | 'sales';

  @Column({ type: 'int', default: 0 })
  @ApiProperty({
    description: 'Quantidade de registros criados na sincronização',
    example: 5,
    default: 0,
  })
  createdCount: number;

  @Column({ type: 'int', default: 0 })
  @ApiProperty({
    description: 'Quantidade de registros atualizados na sincronização',
    example: 12,
    default: 0,
  })
  updatedCount: number;

  @CreateDateColumn({ type: 'timestamp', name: 'executed_at' })
  @ApiProperty({
    description: 'Data e hora da execução da sincronização',
    example: '2025-10-17T14:32:00Z',
    readOnly: true,
  })
  executedAt: Date;
}

/*
🕓 17/10/2025 - adição dos decorators @ApiProperty (Swagger) à entidade SyncLog
--------------------------------------------
Lógica: define a entidade que armazena logs de sincronização com o Bling,
documentando todos os campos para exibição completa no Swagger.
by: gabbu (github: gabriellesote)
*/
