import { StudentReqI } from '@/shares';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StudentReq implements StudentReqI {
  @ApiProperty({
    example: 'name',
    description: 'full name of the student',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'test@gmail.com',
    description: 'email of the student',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'school name',
    description: 'name of the school',
    required: false,
  })
  @IsString()
  @IsOptional()
  school: string | null;

  @ApiProperty({
    example: 'parent name',
    description: 'full name of the parent',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  parent_name: string | null;

  @ApiProperty({
    example: '0901234567',
    description: 'phone number of the parent',
    nullable: true,
    required: false,
  })
  @IsOptional()
  @IsString()
  parent_phone: string | null;
}

export class StudentReqWithAvatar extends StudentReq {
  @ApiProperty({
    type: 'string',
    format: 'binary', // inform to Swagger that this is a file upload
    required: false, // avatar is not required to update
    description: 'Avatar of user',
  })
  avatar: any;
}
