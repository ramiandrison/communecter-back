import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { MESSAGE_EXPIRED_TOKEN } from 'src/constants/view-model';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
          context.getHandler(),
          context.getClass(),
        ]);
        if (isPublic) {
          return true;
        }
        
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        if (err || !user) {
          throw err || new UnauthorizedException(null, MESSAGE_EXPIRED_TOKEN);
        }
        return user;
    }
}
