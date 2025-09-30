import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import emailConfig from '../config/email.config';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';


@Module({
imports: [ConfigModule.forFeature(emailConfig)],
controllers: [EmailController], // remova se não quiser HTTP endpoint
providers: [EmailService],
exports: [EmailService],
})
export class EmailModule {}