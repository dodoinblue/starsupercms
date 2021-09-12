import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MetadataKey } from '../constants/metadata';
import { JwtGuard } from '../guards/jwt.guard';
import { SelfGuard } from '../guards/self.guard';

export function Self(userIdPath = 'params.userId') {
  return applyDecorators(
    SetMetadata(MetadataKey.USER_ID_PATH, userIdPath),
    ApiBearerAuth(),
    UseGuards(JwtGuard, SelfGuard),
  );
}
