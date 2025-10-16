import 'dotenv/config';
import { DataSource } from 'typeorm';

import { User } from '@user/user.entity';
import { Product } from '@product/product.entity';
import { Category } from '@category/category.entity';
import { Order } from '@order/order.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: false,
  logging: ['error'],
  entities: [User, Product, Category, Order],
  migrations: ['dist/migrations/*.js'],

});
