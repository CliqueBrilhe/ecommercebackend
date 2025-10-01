import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Produto } from './produto/produto.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  synchronize: false,
  logging: ['error'],
  entities: [Produto],
  migrations: ['src/migrations/*.ts'],
});
