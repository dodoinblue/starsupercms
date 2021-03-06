import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CustomError, ErrCodes } from '../errors/errors';
import lodash from 'lodash';
import { Reflector } from '@nestjs/core';
import { MetadataKey } from '../constants/metadata';

@Injectable()
export class SelfGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const userIdPath = this.reflector.get<string>(MetadataKey.USER_ID_PATH, context.getHandler());
    const request = context.switchToHttp().getRequest();
    const userFromToken = request.custom.sub;
    const userFromParam = lodash.get(request, userIdPath);
    if (
      lodash.isString(userFromParam) &&
      lodash.isString(userFromToken) &&
      userFromParam === userFromToken
    ) {
      return true;
    } else {
      throw new CustomError(
        ErrCodes.AUTH_UNAUTHORIZED,
        'Only owner have access to this data',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
