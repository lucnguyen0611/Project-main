import { ExecutionContext, Injectable } from '@nestjs/common';
import { BaseDataInterceptor } from '@/modules/base/interceptor';
import { Request } from 'express';
import { Role, UserResI } from '@/shares';

interface RequestWithUser extends Request {
  user: UserResI;
}

@Injectable()
export class ExamInterceptor extends BaseDataInterceptor {
  transform(item: any, context: ExecutionContext) {
    // AuthGuard has made RequestWithUser
    const request: RequestWithUser = context
      .switchToHttp()
      .getRequest<RequestWithUser>();
    const userRole: Role = request.user.role;

    // if the user's role is student and the item has questions
    if (item && typeof item === 'object' && Array.isArray(item.questions)) {
      if (userRole === Role.STUDENT) {
        const transformedItem = { ...item };
        transformedItem.questions = transformedItem.questions.map((q) => {
          const { correct_answer, ...rest } = q;
          return rest;
        });

        return transformedItem;
      }
    }

    return item;
  }
}
