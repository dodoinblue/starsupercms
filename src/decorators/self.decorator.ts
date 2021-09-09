import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { SelfGuard } from '../guards/self.guard';

export function Self(userIdPath = 'params.userId') {
  return applyDecorators(SetMetadata('userIdPath', userIdPath), UseGuards(SelfGuard));
}
