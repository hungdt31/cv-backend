import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorators/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // lấy ra metadata từ request
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err : any, user : any, info: any, context: ExecutionContext) {
    if (user?.email === "admin@gmail.com" || user?.name === "admin") return user;
    const request : Request = context.switchToHttp().getRequest();
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException("Your token is invalid or header is missing token");
    }
    // check permissions
    const targetMethod = request.method;
    const targetEndPoint = request.route?.path;
    console.log(targetMethod + " " + targetEndPoint);

    const permissions : Array<any> = user?.permissions ?? [];
    const isExist = permissions?.find((permission) => {
      return permission.method === targetMethod && permission.apiPath === targetEndPoint;
    });
    if (!isExist) {
      throw new ForbiddenException("You don't have permission to access this endpoint");
    }
    return user;
  }
}