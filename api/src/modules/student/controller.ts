import {
    Body,
    Controller,
    Delete,
    Get, MaxFileSizeValidator,
    Param, ParseFilePipe,
    ParseIntPipe,
    Put, UploadedFile, UseInterceptors,
} from '@nestjs/common';
import {ApiTags, ApiBearerAuth, ApiConsumes, ApiBody} from '@nestjs/swagger';
import type {FileServiceI, StudentServiceI} from '@/shares';
import {StudentReq} from '@/modules/student/dtos';
import {StudentServiceToken, FileServiceToken, Role} from '@/shares';
import {Inject, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@/modules/auth/guard';
import {RolesGuard} from '@/modules/auth/roles.guard';
import {Roles} from '@/modules/auth/roles.decorator';
import {FileInterceptor} from "@nestjs/platform-express";
import {StudentReqWithAvatar} from "@/modules/student/dtos";
import {MultiFileType} from "@/shares/validators/multiFileType";

@ApiTags('Students')
@Controller('/students')
@ApiBearerAuth()
@Roles(Role.STUDENT, Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
export class StudentController {
    constructor(
        @Inject(StudentServiceToken)
        private readonly studentService: StudentServiceI,
        @Inject(FileServiceToken)
        private readonly fileService: FileServiceI,
    ) {}

    @Get()
    findAll() {
        return this.studentService.find();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.studentService.findOne(id);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('avatar'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Update information and avatar',
        type: StudentReqWithAvatar
    })
    async updateOne(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: StudentReq,
        @UploadedFile(
            // use Pipe to validate the file
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({maxSize: 1024 * 1024 * 10}), // 10MB
                    new MultiFileType({
                        fileTypes: ['image/png', 'image/jpeg', 'image/gif'],
                    }),
                ],
                fileIsRequired: false,
            }),
        )
        file: Express.Multer.File,
    ) {
        let avatarId: number | undefined = undefined;
        if (file) {
            // upload and create a file record
            const avatarFile = await this.fileService.uploadAndCreateFile(file);
            avatarId = avatarFile.id;
        }

        const updateData = {...data};
        if (avatarId) {
            updateData['avatar'] = avatarId;
        }
        return this.studentService.updateOne(id, updateData);
    }

    @Delete(':id')
    softDelete(@Param('id', ParseIntPipe)
               id: number
    ) {
        return this.studentService.softDelete(id);
    }
}
