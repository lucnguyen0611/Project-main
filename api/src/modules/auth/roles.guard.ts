import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ROLES_KEY} from './roles.decorator';
import {Role} from '@/shares';

import {Request} from 'express';
import {UserResI} from '@/shares';

interface RequestWithUser extends Request {
    user: UserResI;
}

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    canActivate(context: ExecutionContext): boolean {
        // List of roles from metadata (assigned by @Roles)
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // If the route does not have decorator @Roles, allow access
        if (!requiredRoles) {
            return true;
        }

        // Get user from request
        const {user} = context.switchToHttp().getRequest<RequestWithUser>();

        // compare the role
        const hasPermission: boolean = requiredRoles.includes(user.role);

        if (hasPermission) {
            return true;
        }

        throw new ForbiddenException(
            'You do not have permission to access this resource.',
        );
    }
}
