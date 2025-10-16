// src/Bling/sync/test-sync-categories.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { BlingCategoriasSyncService } from './services/bling-categorias-sync.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const syncService = app.get(BlingCategoriasSyncService);

  await syncService.syncCategories();

  console.log('Sync de categorias finalizado!');
  await app.close();
}

bootstrap();
