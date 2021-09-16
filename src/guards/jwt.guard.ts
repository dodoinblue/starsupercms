import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import jwt from 'jsonwebtoken';
import lodash from 'lodash';
import { AUTH } from '../config/configurations';
import { CustomError, ErrCodes } from '../errors/errors';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers['authorization'] || '';
    const token = authorization.replace('Bearer ', '');

    try {
      const decoded = jwt.verify(token, AUTH.jwt.secretOrKey);
      if (!request.custom) {
        request.custom = {};
      }
      const picked = lodash.pick(decoded, ['sub', 'username', 'roles']);
      Object.assign(request.custom, picked);
      return true;
    } catch (error) {
      throw new CustomError(
        error.name || ErrCodes.AUTH_UNAUTHORIZED,
        error.message,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
