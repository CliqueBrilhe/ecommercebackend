import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';


@Controller('email')
export class EmailController {
constructor(private readonly email: EmailService) {}


@Post('simple')
sendSimple(@Body() dto: SendEmailDto) {
return this.email.sendSimple(dto);
}


@Post('template')
sendTemplate(@Body() dto: SendEmailDto) {
return this.email.sendTemplate(dto);
}
}