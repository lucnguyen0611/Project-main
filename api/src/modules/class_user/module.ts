import { Module } from '@nestjs/common';
import {DataSource} from "typeorm";
import {DatabaseModule} from "@/database/module";
import {DATA_SOURCE, ClassUserEntityRepository, ClassUserServiceToken} from "@/shares";
import {ClassUserEntity} from "@/modules/class_user/entity";
import {ClassUserService} from "@/modules/class_user/service";

@Module({
    imports: [DatabaseModule],
    providers: [{
        provide: ClassUserEntityRepository,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ClassUserEntity),
        inject: [DATA_SOURCE]
    }, {
        provide: ClassUserServiceToken,
        useClass: ClassUserService
    }],
    exports: [ClassUserServiceToken]
})
export class ClassUserModule {}