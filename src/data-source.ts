import 'dotenv/config';
import { DataSource } from 'typeorm';

import { User } from './Modules/User/entities/user.entity';
import { Product } from '@product/product.entity';
import { Category } from '@category/category.entity';
import { Order } from '@order/order.entity';
import { Address } from '@address/address.entity';


const isDev = process.env.NODE_ENV === 'development';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: isDev
    ? process.env.DEV_DB_URL
    : process.env.PROD_DB_URL || '', // produção ainda vazia
  ssl: isDev
    ? false
    : { rejectUnauthorized: false }, // SSL só em produção
  synchronize: isDev, // sincroniza automaticamente em dev
  logging: ['error'],
  entities: [Product, Category],
  migrations: ['dist/migrations/*.js'],
});

/*
1. 16/10/2025
2. DataSource adaptado para usar:
   - Banco de dados de desenvolvimento (DEV_DB_URL) ou produção (PROD_DB_URL)
   - SSL apenas em produção
   - Synchronize ativo apenas em dev
--------------------------------------------
by: gabbu (github: gabriellesote)
*/
