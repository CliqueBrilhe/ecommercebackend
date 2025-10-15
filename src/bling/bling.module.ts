import { Module } from '@nestjs/common';
import { BlingService } from './bling.service';
import { BlingController } from './bling.controller';

@Module({
  imports: [],  
  controllers: [BlingController],
  providers: [BlingService],
})
export class BlingModule {}
