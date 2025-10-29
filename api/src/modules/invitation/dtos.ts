import {ApiProperty} from "@nestjs/swagger";
import {MinLength, IsNotEmpty, IsNumber, IsString} from "class-validator";
import {InvitationI} from "@/shares/type/invitation";

export class InvitationDto implements InvitationI {
    @ApiProperty({
        description: 'ID of the user',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    user_id: number;

    @ApiProperty({
        description: 'ID of the class',
        example: 2,
    })
    @IsNumber()
    @IsNotEmpty()
    class_id: number;

    @ApiProperty({
        description: 'passcode of the class',
        example: '101abc',
        minLength: 6,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    code: string;
}