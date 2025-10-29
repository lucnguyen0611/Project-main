import { Module } from '@nestjs/common';
import { UserModule } from '@/modules/user/module';
import { AdminService } from '@/modules/admin/service';
import { AdminController } from '@/modules/admin/controller';
import { AdminServiceToken } from '@/shares';
import { FileModule } from '@/modules/file/module';

@Module({
  imports: [UserModule, FileModule],
  controllers: [AdminController],
  providers: [
    {
      provide: AdminServiceToken,
      useClass: AdminService,
    },
  ],
})
export class AdminModule {}
