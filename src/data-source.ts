import 'dotenv/config';
import { DataSource } from 'typeorm';

import { User } from './Modules/User/entities/user.entity';
import { Address } from '@address/address.entity';
import { Review } from 'Modules/Review/entities/review.entity';
import { WishlistItem } from 'Modules/Wishlist/entities/wishlist-item.entity';

import { Product } from '@product/product.entity';
import { Category } from '@category/category.entity';

import { Order } from '@order/order.entity';
import { OrderItem } from '@order/order-item.entity';

import { Cart } from 'Modules/Cart/entities/cart.entity';
import { CartItem } from 'Modules/Cart/entities/cart-item.entity';

import { Invoice } from 'Modules/Invoice/entities/invoice.entity';
import { Payment } from 'Modules/Payment/entities/payment.entity';
import { PaymentMethod } from 'Modules/Payment/entities/payment-method.entity';

const isDev = process.env.NODE_ENV === 'development';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: isDev ? process.env.DEV_DB_URL : process.env.PROD_DB_URL || '', // produção ainda vazia
  ssl: isDev ? false : { rejectUnauthorized: false }, // SSL só em produção
  synchronize: isDev, // sincroniza automaticamente em dev
  logging: ['error'],
  entities: [
    Product,
    Category,
    User,
    Order,
    OrderItem,
    Address,
    Review,
    WishlistItem,
    Cart,
    CartItem,
    Invoice,
    Payment,
    PaymentMethod,
  ],
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
