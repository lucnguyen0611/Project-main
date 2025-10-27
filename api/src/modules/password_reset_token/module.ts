import { DATA_SOURCE } from '@/shares';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database/module';
import { PasswordResetTokenEntity } from '@/modules/password_reset_token/entity';
import { PasswordResetTokenRepository } from '@/shares';
import { DataSource } from 'typeorm';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: PasswordResetTokenRepository,
      useFactory: (dataSource: DataSource) =>
        dataSource.getRepository(PasswordResetTokenEntity),
      inject: [DATA_SOURCE],
    },
  ],
  exports: [PasswordResetTokenRepository],
})
export class PasswordResetTokenModule {}
