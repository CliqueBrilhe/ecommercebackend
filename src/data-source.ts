import 'dotenv/config';
import { DataSource } from 'typeorm';

import { Product } from './Modules/Product/product.entity';
import { Category} from './Modules/Category/category.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: false,
  logging: ['error'],
  entities: [Product, Category],
  migrations: ['src/migrations/*.ts'],
});
