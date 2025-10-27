import { Injectable, Logger } from '@nestjs/common';
import { MailServiceI, SendMailOptions } from '@/infrastructure/mail/interface';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailService implements MailServiceI {
  private readonly transporter: Transporter;
  private readonly logger = new Logger(MailService.name);
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendMail(options: SendMailOptions) {
    try {
      const info = await this.transporter.sendMail({
        from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      this.logger.log(`Message sent: ${info.messageId}`);
    } catch (e) {
      this.logger.error(`Failed to send email to ${options.to.join(', ')}`, e);
      throw e;
    }
  }
}
