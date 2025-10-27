import { ApiProperty } from '@nestjs/swagger';
import {IsString, IsNotEmpty, IsNumber, ValidateNested} from 'class-validator';
import {ExamReqI} from '@/shares';
import {CreateQuestionDTO, UpdateQuestionDTO} from "@/modules/question/dtos";
import {plainToInstance, Transform, Type} from "class-transformer";

//payload / body
class BaseExamDto {
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    exam_group_id: number;

    @ApiProperty({
        example: 'test name',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'abc123',
    })
    @IsString()
    @IsNotEmpty()
    code: string;

    @ApiProperty({
        example: 10,
    })
    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    number_of_question: number;

    @ApiProperty({
        example: 900,
    })
    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    total_time: number;

    @ApiProperty({
        example: 'test description',
    })
    @IsString()
    description: string;
}

export class CreateExamDto extends BaseExamDto implements ExamReqI {

    @ApiProperty({
        type: [CreateQuestionDTO],
        description: 'list of questions',
    })
    @ValidateNested({ each: true })
    @Transform(({ value }) => {
        let parsedValue: any[];
        if (typeof value === 'string') {
            try {
                parsedValue = JSON.parse(value);
            } catch {
                return 'invalid json';
            }
        } else {
            parsedValue = value;
        }
        if (!Array.isArray(parsedValue)) {
            return parsedValue;
        }
        return parsedValue.map(obj => plainToInstance(CreateQuestionDTO, obj));
    })
    questions: CreateQuestionDTO[];
}

export class CreateExamWithFileDto extends CreateExamDto {
    @ApiProperty({
        type: 'string',
        format: 'binary', // inform to Swagger that this is a file upload
        required: true, // a file is required to create an exam
        description: 'exam document file (pdf/images)',
    })
    examFile: any;
}

export class UpdateExamDto extends BaseExamDto implements ExamReqI {
    @ApiProperty({
        type: [UpdateQuestionDTO],
        description: 'list of questions',
    })
    @ValidateNested({ each: true })
    @Transform(({ value }) => {
        let parsedValue: any[];
        if (typeof value === 'string') {
            try {
                parsedValue = JSON.parse(value);
            } catch {
                return 'invalid json';
            }
        } else {
            parsedValue = value;
        }
        if (!Array.isArray(parsedValue)) {
            return parsedValue;
        }
        return parsedValue.map(obj => plainToInstance(UpdateQuestionDTO, obj));
    })
    questions: UpdateQuestionDTO[];
}

export class UpdateExamWithFileDto extends UpdateExamDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        required: false,
        description: 'exam document file (pdf/images)'
    })
    examFile: any;
}
