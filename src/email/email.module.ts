import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService], // exporta se quiser usar em outros módulos
})
export class EmailModule {}
