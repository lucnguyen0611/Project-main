import { BaseDataInterceptor } from '@/modules/base/interceptor';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { RequestWithUser, Role, ClassResI } from '@/shares';

@Injectable()
export class ClassInterceptor extends BaseDataInterceptor {
  transform(item: ClassResI, context: ExecutionContext) {
    // AuthGuard has made RequestWithUser
    const request: RequestWithUser = context
      .switchToHttp()
      .getRequest<RequestWithUser>();
    const userRole: Role = request.user.role;

    // if the user's role is student => not allowed to see class code
    if (item && typeof item === 'object' && userRole === Role.STUDENT) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { code, ...rest } = item;

      return rest;
    }

    return item;
  }
}
