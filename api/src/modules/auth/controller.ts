import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { type AuthServiceI, AuthServiceToken } from '@/shares';
import {
  ForgotPasswordReq,
  LoginReq,
  RegisterReq,
  ResetPasswordReq,
  RefreshTokenReq,
} from './dtos';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(
    @Inject(AuthServiceToken)
    private readonly authService: AuthServiceI,
  ) {}

  @Post('register')
  register(@Body() registerReq: RegisterReq) {
    return this.authService.register(registerReq);
  }

  @Post('login')
  login(@Body() loginReq: LoginReq) {
    return this.authService.login(loginReq);
  }

  @Post('refresh')
  refreshToken(@Body() refreshTokenReq: RefreshTokenReq) {
    return this.authService.refreshToken(refreshTokenReq);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordReq: ForgotPasswordReq) {
    return this.authService.forgotPassword(forgotPasswordReq);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordReq: ResetPasswordReq) {
    return this.authService.resetPassword(resetPasswordReq);
  }
}
