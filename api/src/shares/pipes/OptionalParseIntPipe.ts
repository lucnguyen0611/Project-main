import {PipeTransform, Injectable, ArgumentMetadata} from '@nestjs/common';

@Injectable()
export class OptionalParseIntPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (value === undefined || value === null) {
            return undefined;
        }
        return parseInt(value, 10);
    }
}