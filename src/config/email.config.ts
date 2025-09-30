import { registerAs } from '@nestjs/config';


export default registerAs('email', () => ({
from: process.env.EMAIL_FROM ?? 'no-reply@example.com',
sendgridApiKey: process.env.SENDGRID_API_KEY ?? '',
defaultTemplateId: process.env.SENDGRID_TEMPLATE_ID,
}));