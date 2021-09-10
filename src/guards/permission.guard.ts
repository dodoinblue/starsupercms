import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { MetadataKey } from '../constants/metadata';
import { CustomError, ErrCodes } from '../errors/errors';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermissions = this.reflector.get<string[]>(
      MetadataKey.PERMISSIONS,
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    const roles: string[] = request.custom.roles || [];

    if (roles.length > 0) {
      // TODO: Implement
      // const getPermOfRoles = [];
      // return requiredPermissions.every((perm) => getPermOfRoles.includes(perm));
      return roles.includes('admin');
    } else {
      throw new CustomError(
        ErrCodes.AUTH_UNAUTHORIZED,
        `Permissions [${requiredPermissions.join(',')}] are required`,
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
