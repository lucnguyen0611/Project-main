import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {map, Observable} from 'rxjs';

@Injectable()
export abstract class BaseDataInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        return next.handle().pipe(
            map(data => this.processData(data, context))
        );
    }

    abstract transform(item: any, context: ExecutionContext): any;

    private processData(data: any, context: ExecutionContext) {
        if (!data) return data;

        // if data is array, transform each member of data
        if (Array.isArray(data)) {
            return data.map(item => this.transform(item, context));
        }

        // if data is an object
        return this.transform(data, context);
    }
}

