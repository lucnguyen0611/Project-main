import { Module } from '@nestjs/common';
import { DatabaseModule } from "@/database/module";
import {UserModule} from "@/modules/user/module";
import {DataSource} from "typeorm";
import {DATA_SOURCE, ExamGroupEntityRepository, ExamGroupServiceToken} from "@/shares";
import {ExamGroupEntity} from "@/modules/exam_group/entity";
import {ExamGroupService} from "@/modules/exam_group/service";
import {ExamGroupController} from "@/modules/exam_group/controller";


@Module({
    imports: [DatabaseModule, UserModule],  // UserModule has UserServiceToken needed for auth
    controllers: [ExamGroupController],
    providers: [{
        provide: ExamGroupEntityRepository,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ExamGroupEntity),
        inject: [DATA_SOURCE]
    },{
        provide: ExamGroupServiceToken,
        useClass: ExamGroupService
    }]
})
export class ExamGroupModule {}