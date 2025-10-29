import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsNotEmpty, IsNumber, IsOptional, IsEnum} from 'class-validator';
import {QuestionReqI, QuestionType} from '@/shares';

//payload / body
export class CreateQuestionDTO implements QuestionReqI {

    @ApiProperty({
        example: 0,
    })
    @IsNumber()
    @IsNotEmpty()
    index: number;

    @ApiProperty({
        example: 'multiple-choice',
        description: 'type of the question',
        enum: QuestionType,
    })
    @IsEnum(QuestionType, {message: 'type must be one of: single-choice, multiple-choice, long-response'})
    @IsNotEmpty()
    type: QuestionType;

    @ApiProperty({
        example: 'A,C',
    })
    @IsString()
    correct_answer: string;

    @IsNumber()
    @IsOptional()
    exam_id?: number;
}

export class UpdateQuestionDTO extends CreateQuestionDTO {
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    @IsOptional()
    id?: number;
}
