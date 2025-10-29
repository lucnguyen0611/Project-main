import {Controller, Get, Param, Res, ParseIntPipe, Inject, UseGuards} from '@nestjs/common';
import type {Response} from 'express';
import {type FileServiceI, FileServiceToken} from "@/shares";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {AuthGuard} from "@/modules/auth/guard";

@ApiTags('PDF Viewer')
@Controller('pdf-viewer')
export class PDFViewerController {
    constructor(
        @Inject(FileServiceToken)
        private readonly fileService: FileServiceI
    ) {
    }

    @Get(':fileId')
    async viewPDF(@Param('fileId', ParseIntPipe) fileId: number, @Res() res: Response) {
        const file = await this.fileService.findOne(fileId);

        if (!file || file.file_type !== 'pdf') {
            return res.status(404).send('PDF not found');
        }

        const htmlContent = this.generatePDFViewerHTML(file.url);
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('X-Frame-Options', 'ALLOWALL'); // allow embedding in iframe
        res.send(htmlContent);
    }

    private generatePDFViewerHTML(pdfUrl: string): string {
        return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>PDF Viewer</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { height: 100vh; overflow: hidden; }
            #pdf-viewer { width: 100%; height: 100%; }
        </style>
    </head>
    <body>
        <iframe id="pdf-viewer"
                src="https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(pdfUrl)}"
                frameborder="0">
        </iframe>
    </body>
    </html>
    `;
    }
}