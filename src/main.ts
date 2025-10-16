import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configuração CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    credentials: true,
  });

  // Assets estáticos
  app.useStaticAssets(join(__dirname, '..', 'uploads'));

  // ------------------- Swagger -------------------
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Clique e Brilhe API')
      .setDescription('Documentação mínima do backend do projeto')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token'
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    console.log(
      'Swagger running at: http://localhost:' +
        (process.env.DEV_PORT || 7777) +
        '/api'
    );
  }
  // ------------------------------------------------

  const PORT =
    process.env.NODE_ENV === 'development'
      ? process.env.DEV_PORT || 7777
      : process.env.PROD_PORT || 3000;

  await app.listen(PORT);
  console.log(`App is running on: http://localhost:${PORT}`);
}

bootstrap();

/*
1. 16/10/2025
2. Configuração do NestExpressApplication com:
   - CORS para localhost:5173 e 8080
   - Assets estáticos na pasta uploads
   - Swagger documentando endpoints apenas em desenvolvimento
   - Porta dinâmica: 7777 em dev, configurável em produção
--------------------------------------------
by: gabbu (github: gabriellesote)
*/
