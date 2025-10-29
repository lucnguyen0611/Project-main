import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { type ClassServiceI, ClassServiceToken, Role } from '@/shares';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/modules/auth/guard';
import { Roles } from '@/modules/auth/roles.decorator';
import { RolesGuard } from '@/modules/auth/roles.guard';
import { ClassReq } from '@/modules/class/dtos';
import { ClassInterceptor } from '@/modules/class/interceptor';

@ApiTags('Classes')
@Controller('classes')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ClassController {
  constructor(
    @Inject(ClassServiceToken)
    private readonly classService: ClassServiceI,
  ) {}

  @Get()
  @Roles(Role.TEACHER, Role.ADMIN, Role.STUDENT)
  @UseGuards(RolesGuard)
  @UseInterceptors(ClassInterceptor)
  findAll() {
    return this.classService.find();
  }

  @Get(':id')
  @Roles(Role.TEACHER, Role.ADMIN, Role.STUDENT)
  @UseGuards(RolesGuard)
  @UseInterceptors(ClassInterceptor)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classService.findOne(id);
  }

  @Post()
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(RolesGuard)
  create(@Body() data: ClassReq) {
    return this.classService.createAndJoinClass(data);
  }

  @Put(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(RolesGuard)
  updateOne(@Param('id', ParseIntPipe) id: number, @Body() data: ClassReq) {
    return this.classService.updateOne(id, data);
  }

  @Delete(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @UseGuards(RolesGuard)
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.classService.softDelete(id);
  }
}
