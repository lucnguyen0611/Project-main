import { ApiProperty } from '@nestjs/swagger';
import {FileReqI} from "@/shares";
import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class FileReq implements FileReqI {
    @ApiProperty({
        description: 'ID of the file on Cloudinary',
        example: 'file_123',
    })
    @IsString()
    @IsNotEmpty()
    public_id: string;

    @ApiProperty({
        description: 'URL of the file on Cloudinary',
        example: 'https://res.cloudinary.com/...',
    })
    @IsString()
    @IsNotEmpty()
    url: string;

    @ApiProperty({
        description: 'Original name of the file when uploaded',
        example: 'file.jpg',
    })
    @IsString()
    @IsNotEmpty()
    original_name: string;

    @ApiProperty({
        description: 'Image type of the file when uploaded',
        example: 'image/jpeg',
    })
    @IsString()
    @IsNotEmpty()
    file_type: string;

    @ApiProperty({
        description: 'Size of the file when uploaded',
        example: 1234567890,
    })
    @IsNumber()
    @IsNotEmpty()
    size: number;
}