import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { MetadataKey } from '../constants/metadata';
import { SelfGuard } from '../guards/self.guard';

export function Self(userIdPath = 'params.userId') {
  return applyDecorators(SetMetadata(MetadataKey.USER_ID_PATH, userIdPath), UseGuards(SelfGuard));
}
