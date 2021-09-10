import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { MetadataKey } from '../constants/metadata';
import { PermissionGuard } from '../guards/permission.guard';

export function Permission(permissions: string[]) {
  return applyDecorators(
    SetMetadata(MetadataKey.PERMISSIONS, permissions),
    UseGuards(PermissionGuard),
  );
}
