import 'dotenv/config';
import { DataSource } from 'typeorm';

import { Produto } from './Modules/Product/produto.entity';
import { Categoria } from './Modules/Category/categoria.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: false,
  logging: ['error'],
  entities: [Produto, Categoria],
  migrations: ['src/migrations/*.ts'],
});
