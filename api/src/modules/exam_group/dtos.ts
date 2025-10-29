import {ApiProperty} from '@nestjs/swagger';
import {
    IsString,
    IsNotEmpty,
    IsNumber,
    IsBoolean,
    IsDate,
} from 'class-validator';
import {Type} from 'class-transformer';
import {ExamGroupReqI} from '@/shares';

//payload / body
export class ExamGroupReq implements ExamGroupReqI {
    @ApiProperty({
        example: 'test name',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    class_id: number;

    @ApiProperty({
        example: '2021-01-01',
    })
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    start_time: Date;

    @ApiProperty({
        example: 300,
    })
    @IsNumber()
    await_time: number;

    @ApiProperty({
        example: true,
    })
    @IsBoolean()
    is_once: boolean;

    @ApiProperty({
        example: true,
    })
    @IsBoolean()
    is_save_local: boolean;
}
