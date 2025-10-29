import {ExamResultReqI} from "@/shares/type/exam_result";
import {ValidateNested} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString, IsNotEmpty} from "class-validator";
import {CreateAnswerDTO, UpdateAnswerDTO} from "@/modules/answer/dtos";

class BaseExamResultDto {
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    exam_id: number;

    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    user_id: number;

    @ApiProperty({
        example: 'completed'
    })
    @IsString()
    @IsNotEmpty()
    status: string;

    @ApiProperty({
        example: 'desktop'
    })
    @IsString()
    @IsNotEmpty()
    device: string;
}

export class CreateExamResultDto extends BaseExamResultDto implements ExamResultReqI {

    @ApiProperty({
        type: [CreateAnswerDTO],
        description: 'list of answers',
    })
    @ValidateNested({each: true})
    questions: CreateAnswerDTO[];
}

export class UpdateExamResultDto extends BaseExamResultDto implements ExamResultReqI {
    @ApiProperty({
        type: [UpdateAnswerDTO],
        description: 'list of answers',
    })
    @ValidateNested({each: true})
    questions: UpdateAnswerDTO[];
}