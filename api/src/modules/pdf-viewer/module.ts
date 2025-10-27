import { Module } from '@nestjs/common';
import { PDFViewerController } from '@/modules/pdf-viewer/controller';
import { FileModule } from '@/modules/file/module'

@Module({
    imports: [FileModule],
    controllers: [PDFViewerController],
})
export class PDFViewerModule {}