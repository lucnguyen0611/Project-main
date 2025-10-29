import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
  Inject,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiBody } from '@nestjs/swagger';
import {
  type FileServiceI,
  FileServiceToken,
  type AdminServiceI,
  AdminServiceToken,
} from '@/shares';
import { AdminReq, AdminReqWithAvatar } from '@/modules/admin/dtos';
import { AuthGuard } from '@/modules/auth/guard';
import { RolesGuard } from '@/modules/auth/roles.guard';
import { Roles } from '@/modules/auth/roles.decorator';
import { Role } from '@/shares';
import { FileInterceptor } from '@nestjs/platform-express';
import { MultiFileType } from '@/shares/validators/multiFileType';

@ApiTags('Admins')
@Controller('/admins')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
export class AdminController {
  constructor(
    @Inject(AdminServiceToken)
    private readonly adminService: AdminServiceI,
    @Inject(FileServiceToken)
    private readonly fileService: FileServiceI,
  ) {}

  @Get()
  findAll() {
    return this.adminService.find();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Update information and avatar',
    type: AdminReqWithAvatar,
  })
  async updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: AdminReq,
    @UploadedFile(
      // use Pipe to validate the file
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }), // 10MB
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
      // upload and create the file record
      const avatarFile = await this.fileService.uploadAndCreateFile(file);
      avatarId = avatarFile.id;
    }

    const updateData = { ...data };
    if (avatarId) {
      updateData['avatar'] = avatarId;
    }

    return this.adminService.updateOne(id, updateData);
  }

  @Delete(':id')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.softDelete(id);
  }
}
