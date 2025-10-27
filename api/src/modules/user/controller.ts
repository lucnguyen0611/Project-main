import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {Controller, UseGuards, Inject, Post, Body} from "@nestjs/common";
import {AuthGuard} from "@/modules/auth/guard";
import {UserServiceToken} from "@/shares";
import type {UserServiceI} from "@/shares";
import {ChangePasswordReq} from "@/modules/user/dtos";

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UserController {
    constructor(
        @Inject(UserServiceToken)
        private readonly userService: UserServiceI
    ) {}

    @Post('change-password')
    changePassword(@Body() data: ChangePasswordReq){
        return this.userService.changePassword(data);
    }
}