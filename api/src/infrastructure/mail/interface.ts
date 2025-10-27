export interface SendMailOptions {
  to: string[];
  subject: string;
  html: string;
}

export interface MailServiceI {
  sendMail(options: SendMailOptions): Promise<void>;
}
