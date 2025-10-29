import { ApiProperty } from '@nestjs/swagger';
import { LoginReqI, RegisterReqI, Role } from '@/shares';
import { IsString, IsNotEmpty, IsEnum, IsEmail } from 'class-validator';

export class LoginReq implements LoginReqI {
  @ApiProperty({
    description: 'email of the user',
    example: 'test@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'password of the user',
    example: '1a2b3c4d',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterReq implements RegisterReqI {
  @ApiProperty({
    description: 'full name of the user',
    example: 'Trinh Van Quyet',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'role of the user',
    example: Role.STUDENT,
    enum: Role,
  })
  @IsEnum(Role, { message: 'role must be one of: admin, teacher, student' })
  @IsNotEmpty()
  role: Role;

  @ApiProperty({
    description: 'email of the user',
    example: 'test@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'password of the user',
    example: '1a2b3c4d',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'confirmed',
    description: 'status of the account',
  })
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class ForgotPasswordReq {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'email of the user who forgot password',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ResetPasswordReq {
  @ApiProperty({
    description: 'The password reset token received via email',
    example: 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'The new password for the user',
    example: 'NewStrongPassword123!',
  })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

export class RefreshTokenReq {
  @ApiProperty({
    description: 'Refresh token',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
