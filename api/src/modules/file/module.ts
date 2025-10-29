import {Module} from '@nestjs/common';
import {DataSource} from 'typeorm';
import {FileEntity} from '@/modules/file/entity';
import {DatabaseModule} from '@/database/module';
import {CloudinaryModule} from '@/modules/cloudinary/module';
import {
    DATA_SOURCE,
    FileEntityRepository,
    FileServiceToken,
} from '@/shares';
import {FileService} from '@/modules/file/service';

@Module({
    imports: [DatabaseModule, CloudinaryModule],
    providers: [
        {
            provide: FileEntityRepository,
            useFactory: (dataSource: DataSource) =>
                dataSource.getRepository(FileEntity),
            inject: [DATA_SOURCE],
        },
        {
            provide: FileServiceToken,
            useClass: FileService,
        },
    ],
    exports: [FileEntityRepository, FileServiceToken],
})
export class FileModule {
}
