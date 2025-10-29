import {Module} from "@nestjs/common";
import {ExamResultEntityRepository, ExamResultServiceToken} from "@/shares";
import {DataSource} from "typeorm";
import {DatabaseModule} from "@/database/module";
import {DATA_SOURCE} from "@/shares";
import {ExamResultEntity} from "@/modules/exam_result/entity";
import {UserModule} from "@/modules/user/module";
import {AnswerModule} from "@/modules/answer/module";
import {ExamResultService} from "@/modules/exam_result/service";
import {ExamResultController} from "@/modules/exam_result/controller";

@Module({
    imports: [DatabaseModule, UserModule, AnswerModule],
    controllers: [ExamResultController],
    providers: [{
        provide: ExamResultEntityRepository,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExamResultEntity),
        inject: [DATA_SOURCE]
    }, {
        provide: ExamResultServiceToken,
        useClass: ExamResultService
    }],
})
export class ExamResultModule {
}