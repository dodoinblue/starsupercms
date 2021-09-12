import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MetadataKey } from '../constants/metadata';
import { JwtGuard } from '../guards/jwt.guard';
import { PermissionGuard } from '../guards/permission.guard';

export function Permission(permissions: string[]) {
  return applyDecorators(
    SetMetadata(MetadataKey.PERMISSIONS, permissions),
    ApiBearerAuth(),
    UseGuards(JwtGuard, PermissionGuard),
  );
}
