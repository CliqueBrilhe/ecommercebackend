// src/email/email.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly from: string;
  private readonly defaultTemplateId?: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('email.sendgridApiKey');
    if (!apiKey) {
      this.logger.warn('SENDGRID_API_KEY não definido. E-mails não serão enviados.');
    } else {
      sgMail.setApiKey(apiKey);
    }

    this.from = this.config.get<string>('email.from') ?? 'no-reply@example.com';
    this.defaultTemplateId = this.config.get<string>('email.defaultTemplateId') ?? undefined;
  }

  /** Envia e-mail simples (subject/text/html) usando `content` para satisfazer a tipagem. */
  async sendSimple(dto: SendEmailDto) {
    if (!dto.subject) throw new Error('subject é obrigatório para sendSimple');

    const content: MailDataRequired['content'] = [
      ...(dto.text ? [{ type: 'text/plain', value: dto.text }] : []),
      ...(dto.html ? [{ type: 'text/html', value: dto.html }] : []),
    ];

    if (content.length === 0) {
      content.push({ type: 'text/plain', value: '' }); // garante pelo menos um conteúdo
    }

    const msg: MailDataRequired = {
      to: dto.to,
      from: this.from,
      subject: dto.subject!,
      content,
      attachments: dto.attachments as any,
    } as MailDataRequired;

    this.logger.debug(`Enviando e-mail simples para ${dto.to}`);
    const [res] = await sgMail.send(msg);
    return { status: res.statusCode };
  }

  /** Envia usando Template Transacional do SendGrid. */
  async sendTemplate(dto: SendEmailDto) {
    const templateId = dto.templateId ?? this.defaultTemplateId;
    if (!templateId) throw new Error('Nenhum templateId fornecido (nem default).');

    const msg: MailDataRequired = {
      to: dto.to,
      from: this.from,
      // Para template, o SendGrid ignora `content` quando `templateId` é usado com dynamic data.
      // Mesmo assim, algumas tipagens pedem `content`; adicionamos um stub seguro.
      content: [{ type: 'text/plain', value: '' }],
      templateId,
      dynamicTemplateData: dto.dynamicTemplateData ?? {},
      attachments: dto.attachments as any,
    } as any;

    this.logger.debug(`Enviando e-mail template ${templateId} para ${dto.to}`);
    const [res] = await sgMail.send(msg);
    return { status: res.statusCode };
  }
}
