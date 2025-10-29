import {Module} from '@nestjs/common';
import {DatabaseModule} from "@/database/module";
import {DataSource} from "typeorm";
import {QuestionEntity} from "@/modules/question/entity";
import {DATA_SOURCE, QuestionServiceToken, QuestionEntityRepository} from "@/shares";
import {QuestionService} from "@/modules/question/service";

@Module({
    imports: [DatabaseModule],
    providers: [{
        provide: QuestionEntityRepository,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(QuestionEntity),
        inject: [DATA_SOURCE]
    }, {
        provide: QuestionServiceToken,
        useClass: QuestionService
    }],
    exports: [QuestionServiceToken]
})
export class QuestionModule {
}