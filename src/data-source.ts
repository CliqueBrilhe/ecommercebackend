import 'dotenv/config';
import { DataSource } from 'typeorm';

import { Product } from './Modules/Product/entities/product.entity';
import { Category} from './Modules/Category/entities/category.entity';
import { User } from './Modules/User/entities/user.entity';
import { Order } from './Modules/Order/entities/order.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: false,
  logging: ['error'],
  entities: [Product, Category, User, Order],
  migrations: ['src/migrations/*.ts'],
});
