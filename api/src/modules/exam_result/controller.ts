import {ApiBearerAuth, ApiQuery, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Get, Inject, Param, ParseIntPipe, Post, Put, UseGuards, Query} from "@nestjs/common";
import {ExamResultServiceToken, Role} from "@/shares";
import type {ExamResultServiceI} from "@/shares";
import {CreateExamResultDto, UpdateExamResultDto} from "@/modules/exam_result/dtos";
import {AuthGuard} from "@/modules/auth/guard";
import {Roles} from "@/modules/auth/roles.decorator";
import {RolesGuard} from "@/modules/auth/roles.guard";

@ApiTags('Exam Results')
@Controller('exam_results')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class ExamResultController {
    constructor(
        @Inject(ExamResultServiceToken)
        private readonly examResultService: ExamResultServiceI
    ) {
    }

    @Get()
    @ApiQuery({name: 'student_id', required: true, type: Number, description: 'student ID'})
    @ApiQuery({name: 'exam_group_id', required: true, type: Number, description: 'exam group ID'})
    findAll(
        @Query('student_id', ParseIntPipe) userId: number,
        @Query('exam_group_id', ParseIntPipe) examGroupId: number
    ) {
        return this.examResultService.findAndFilter(userId, examGroupId);
    }

    @Post()
    create(@Body() data: CreateExamResultDto) {
        return this.examResultService.create(data);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.examResultService.findOne(id);
    }

    @Put(':id')
    @Roles(Role.TEACHER, Role.ADMIN)
    @UseGuards(RolesGuard)
    updateOne(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateExamResultDto) {
        return this.examResultService.updateOne(id, data);
    }
}