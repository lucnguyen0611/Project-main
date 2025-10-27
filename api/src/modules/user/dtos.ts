import {ChangePasswordReqI} from "@/shares";
import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty, IsString, Matches, MinLength} from "class-validator";

export class ChangePasswordReq implements ChangePasswordReqI{
    @ApiProperty({
        description: 'The old password of the user',
        example: 'OldPassword',
    })
    @IsString()
    @IsNotEmpty()
    old_password: string;

    @ApiProperty({
        description: 'The new password of the user',
        example: 'NewStrongPassword123!',
    })
    @IsString()
    @IsNotEmpty()
    // @MinLength(8, { message: 'New password must be at least 8 characters long.' })
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //     message: 'New password must contain at least one uppercase letter, one lowercase letter, one number and one special character.',
    // })
    new_password: string;
}