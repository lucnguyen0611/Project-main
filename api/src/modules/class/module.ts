import { Module } from '@nestjs/common';
import { DatabaseModule } from "@/database/module";
import {DATA_SOURCE, ClassEntityRepository, ClassServiceToken} from "@/shares";
import {DataSource} from "typeorm";
import {ClassEntity} from "@/modules/class/entity";
import {ClassService} from "@/modules/class/service";
import {ClassUserModule} from "@/modules/class_user/module";
import {UserModule} from "@/modules/user/module";
import {ClassController} from "@/modules/class/controller";
import {ClassSubscriber} from "@/modules/class/subscriber";

@Module({
    imports: [DatabaseModule, ClassUserModule, UserModule],
    controllers: [ClassController],
    providers: [{
        provide: ClassEntityRepository,
        useFactory: (dataSource: DataSource)=> dataSource.getRepository(ClassEntity),
        inject: [DATA_SOURCE]
    },{
        provide: ClassServiceToken,
        useClass: ClassService
    }, ClassSubscriber
    ],
    exports: [ClassServiceToken]
})
export class ClassModule {}