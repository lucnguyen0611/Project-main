import { Module } from '@nestjs/common';
import { Cloudinary } from './provider';
import { CloudinaryService } from './service';

@Module({
  providers: [Cloudinary, CloudinaryService],
  exports: [Cloudinary, CloudinaryService],
})
export class CloudinaryModule {}
