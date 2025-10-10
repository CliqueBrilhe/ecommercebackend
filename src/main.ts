//  Para rodar a aplicação e conectar ao Banco de dados local: npm run start:dev
/// Para rodar a aplicação e conectar com o banco de dados potsgres: NODE_ENV=production npm run start


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express'; // 👈 importa isso
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // 👈 tipa como Express

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads')); // agora funciona

  await app.listen(process.env.PORT ?? 3000);
  console.log(`App is running on: http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
