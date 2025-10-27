import { ClassReqI } from '@/shares/type/class';
import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString, MinLength} from "class-validator";

export class ClassReq implements ClassReqI {
    @ApiProperty({
        description: 'name of the class',
        example: 'Math 101'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'passcode of the class',
        example: '123abc'
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    code: string;
}