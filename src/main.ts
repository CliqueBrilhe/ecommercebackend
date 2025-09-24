import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; // 👈 importa isso

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
