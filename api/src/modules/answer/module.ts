import {Module} from '@nestjs/common';
import {DatabaseModule} from "@/database/module";
import {DataSource} from "typeorm";
import {AnswerEntity} from "@/modules/answer/entity";
import {DATA_SOURCE, AnswerEntityRepository, AnswerServiceToken} from "@/shares";
import {AnswerService} from "@/modules/answer/service";
import {QuestionModule} from "@/modules/question/module";

@Module({
    imports: [DatabaseModule, QuestionModule],
    providers: [{
        provide: AnswerEntityRepository,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(AnswerEntity),
        inject: [DATA_SOURCE]
    }, {
        provide: AnswerServiceToken,
        useClass: AnswerService
    }],
    exports: [AnswerServiceToken],
})
export class AnswerModule {
}