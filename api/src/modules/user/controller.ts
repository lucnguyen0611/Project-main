import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  UseGuards,
  Inject,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@/modules/auth/guard';
import { Role, UserServiceToken } from '@/shares';
import type { UserServiceI } from '@/shares';
import { ChangePasswordReq } from '@/modules/user/dtos';
import { Roles } from '@/modules/auth/roles.decorator';
import { RolesGuard } from '@/modules/auth/roles.guard';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    @Inject(UserServiceToken)
    private readonly userService: UserServiceI,
  ) {}

  @Post('change-password')
  changePassword(@Body() data: ChangePasswordReq) {
    return this.userService.changePassword(data);
  }

  // this can be used by admins only
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.userService.find();
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.softDelete(id);
  }
}
