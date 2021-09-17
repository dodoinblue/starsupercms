import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { BasicTreeQuery } from '../../../common/dto/query-options.dto';
import { Group } from '../entities/group.entity';

export class CreateGroupDto extends PickType(Group, [
  'name',
  'description',
  'parentId',
  'type',
  'status',
  'seq',
]) {}
export class UpdateGroupDto extends PartialType(CreateGroupDto) {}

export class GroupQueryOptions extends IntersectionType(
  PickType(UpdateGroupDto, ['name', 'description', 'type', 'status', 'seq']),
  BasicTreeQuery,
) {}
