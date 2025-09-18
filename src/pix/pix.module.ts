import { Module } from '@nestjs/common';
import { PixController } from '../pix/pix.controller';
import { PixService } from '../pix/pix.service';

@Module({
  controllers: [PixController],
  providers: [PixService],
})
export class PixModule {}