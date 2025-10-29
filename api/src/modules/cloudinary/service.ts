import {Injectable} from '@nestjs/common';
import {UploadApiResponse, v2 as cloudinary} from 'cloudinary';

@Injectable()
export class CloudinaryService {
    async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {

            const resourceType = this.getResourceType(file.mimetype);

            const upload = cloudinary.uploader.upload_stream(
                {
                    resource_type: resourceType,
                    folder: 'uploads',    // destination folder on Cloudinary
                },
                (error, result) => {
                    if (error) {
                        return reject(new Error(JSON.stringify(error)));
                    }
                    if (result) {
                        resolve(result);
                    } else {
                        reject(new Error('Cloudinary did not return a result.'));
                    }
                },
            );
            upload.end(file.buffer);
        });
    }

    private getResourceType(mimetype: string): 'image' | 'video' | 'raw' {
        if (mimetype.startsWith('image/')) {
            return 'image';
        } else if (mimetype.startsWith('video/')) {
            return 'video';
        } else {
            return 'raw';
        }
    }
}
