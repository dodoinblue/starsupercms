import { PartialType, PickType } from '@nestjs/swagger';
import { Announce } from '../entities/announce.entity';

export class CreateAnnounceDto extends PickType(Announce, [
  'title',
  'content',
  'link',
  'type',
  'icon',
  'status',
  'expireAt',
]) {}

export class UpdateAnnounceDto extends PartialType(CreateAnnounceDto) {}
