import { Module } from '@nestjs/common';
import { MailServiceToken } from '@/infrastructure/mail/const';
import { MailService } from '@/infrastructure/mail/service';

@Module({
  providers: [
    {
      provide: MailServiceToken,
      useClass: MailService,
    },
  ],
  exports: [MailServiceToken],
})
export class MailModule {}
