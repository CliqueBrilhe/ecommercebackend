import 'dotenv/config';
import { DataSource } from 'typeorm';

import { Produto } from './produto/produto.entity';
import { Categoria } from './categoria/categoria.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: false,
  logging: ['error'],
  entities: [Produto, Categoria],
  migrations: ['src/migrations/*.ts'],
});
