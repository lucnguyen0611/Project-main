import {Module} from '@nestjs/common';
import {UserModule} from '@/modules/user/module';
import {FileModule} from '@/modules/file/module';
import {StudentService} from '@/modules/student/service';
import {StudentServiceToken} from '@/shares';
import {StudentController} from '@/modules/student/controller';

@Module({
    imports: [UserModule, FileModule],
    controllers: [StudentController],
    providers: [
        {
            provide: StudentServiceToken,
            useClass: StudentService,
        },
    ],
})
export class StudentModule {
}
