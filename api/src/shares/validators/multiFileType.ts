import {Injectable, FileValidator} from '@nestjs/common';

@Injectable()
export class MultiFileType extends FileValidator<{ fileTypes: string[] }> {
    constructor(options: { fileTypes: string[] }) {
        super(options);
    }

    isValid(file?: Express.Multer.File): boolean | Promise<boolean> {
        if (!file) return true; // Allow if no file (due to fileIsRequired: false)
        return this.validationOptions.fileTypes.includes(file.mimetype);
    }

    buildErrorMessage(): string {
        return `File type must be one of: ${this.validationOptions.fileTypes.join(', ')}`;
    }
}