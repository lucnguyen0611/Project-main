import {AnswerReqI} from '@/shares/type/answer';
import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString, IsOptional} from "class-validator";

export class CreateAnswerDTO implements AnswerReqI {
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    question_id: number;

    @ApiProperty({
        example: 'A,B',
        default: ''
    })
    @IsString()
    answer: string;

    @IsNumber()
    @IsOptional()
    exam_result_id?: number;
}

export class UpdateAnswerDTO extends CreateAnswerDTO {
    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({
        example: [true, false],
        nullable: true,
    })
    @IsArray()
    @IsBoolean({each: true},)
    is_correct: boolean[] | null;
}