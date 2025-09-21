import { Module } from '@nestjs/common';
import { ImagemController } from './imagem.controller';
import { ImagemService } from './imagem.service';

@Module({
  controllers: [ImagemController],
  providers: [ImagemService],
})
export class ImagemModule {}
