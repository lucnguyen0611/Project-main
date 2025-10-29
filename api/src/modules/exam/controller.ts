import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    Put,
    Query,
    ParseIntPipe,
    UseGuards,
    UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator
} from '@nestjs/common';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiTags} from '@nestjs/swagger';
import {ExamServiceToken, FileServiceToken, Role} from "@/shares";
import type {ExamServiceI, FileServiceI} from "@/shares";
import {CreateExamDto, UpdateExamDto, CreateExamWithFileDto, UpdateExamWithFileDto} from "@/modules/exam/dtos";
import {AuthGuard} from "@/modules/auth/guard";
import {RolesGuard} from "@/modules/auth/roles.guard";
import {ExamInterceptor} from "@/modules/exam/interceptor";
import {FileInterceptor} from "@nestjs/platform-express";
import {MultiFileType, OptionalParseIntPipe} from "@/shares";
import {Transactional} from "typeorm-transactional";
import {Roles} from "@/modules/auth/roles.decorator";

@ApiTags('Exams')
@Controller('exams')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ExamController {
    constructor(
        @Inject(ExamServiceToken)
        private readonly examService: ExamServiceI,
        @Inject(FileServiceToken)
        private readonly fileService: FileServiceI,
    ) {
    }

    @Get()
    @UseInterceptors(ExamInterceptor)
    @ApiQuery({
        name: 'exam_group_id',
        required: false,
        type: Number,
        description: 'Optional exam group ID to filter exams'
    })
    findAll(@Query('exam_group_id', OptionalParseIntPipe) examGroupId?: number) {
        if (examGroupId && examGroupId > 0) {
            return this.examService.find({exam_group_id: examGroupId})
        }
        return this.examService.find();
    }

    @Get(':id')
    @UseInterceptors(ExamInterceptor)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.examService.findOne(id);
    }

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'File for the exam',
        type: CreateExamWithFileDto
    })
    @Roles(Role.TEACHER, Role.ADMIN)
    @UseGuards(RolesGuard)
    @Transactional()
    @UseInterceptors(FileInterceptor('examFile'))
    async create(
        @Body() data: CreateExamDto,
        @UploadedFile(
            // use Pipe to validate the file
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({maxSize: 1024 * 1024 * 10}), // 10MB
                    new MultiFileType({
                        fileTypes: ['image/png', 'image/jpeg', 'image/gif', 'application/pdf'],
                    }),
                ],
                fileIsRequired: true,
            }),
        )
        file: Express.Multer.File,
    ) {
        // upload and create a file record
        const examFile = await this.fileService.uploadAndCreateFile(file);

        const createData = {...data};
        if (examFile.id) {
            createData['file_id'] = examFile.id;
        }

        return this.examService.create(createData);
    }

    @Put(':id')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'File for the exam',
        type: UpdateExamWithFileDto
    })
    @Roles(Role.TEACHER, Role.ADMIN)
    @UseGuards(RolesGuard)
    @Transactional()
    @UseInterceptors(FileInterceptor('examFile'))
    async updateOne(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateExamDto,
        @UploadedFile(
            // use Pipe to validate the file
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({maxSize: 1024 * 1024 * 10}), // 10MB
                    new MultiFileType({
                        fileTypes: ['image/png', 'image/jpeg', 'image/gif', 'application/pdf'],
                    }),
                ],
                fileIsRequired: false,
            }),
        )
        file?: Express.Multer.File,
    ) {
        let fileId: number | undefined = undefined;
        if (file) {
            // upload and create a file record
            const examFile = await this.fileService.uploadAndCreateFile(file);
            fileId = examFile.id;
        }

        const updateData = {...data};
        if (fileId) {
            updateData['file_id'] = fileId;
        }
        return this.examService.updateOne(id, updateData);
    }

    @Delete(':id')
    @Roles(Role.TEACHER, Role.ADMIN)
    @UseGuards(RolesGuard)
    softDelete(@Param('id', ParseIntPipe) id: number) {
        return this.examService.softDelete(id);
    }
}