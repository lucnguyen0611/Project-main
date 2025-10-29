import {Module} from '@nestjs/common';
import {UserModule} from '@/modules/user/module';
import {TeacherService} from '@/modules/teacher/service';
import {TeacherController} from '@/modules/teacher/controller';
import {TeacherServiceToken} from '@/shares';
import {FileModule} from '@/modules/file/module';

@Module({
    imports: [UserModule, FileModule],
    controllers: [TeacherController],
    providers: [
        {
            provide: TeacherServiceToken,
            useClass: TeacherService,
        },
    ],
})
export class TeacherModule {
}
