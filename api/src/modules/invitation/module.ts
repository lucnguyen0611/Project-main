import { Module } from '@nestjs/common';
import { ClassUserModule } from '@/modules/class_user/module';
import { ClassModule } from "@/modules/class/module";
import { UserModule } from "@/modules/user/module";
import { InvitationService } from "@/modules/invitation/service";
import { InvitationServiceToken } from "@/shares";
import {InvitationController} from "@/modules/invitation/controller";

@Module({
    imports: [ClassUserModule, ClassModule, UserModule],
    controllers: [InvitationController],
    providers: [{
        provide: InvitationServiceToken,
        useClass: InvitationService
    }],
})
export class InvitationModule {}