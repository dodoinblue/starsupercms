import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
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

export class AssignGroupMembers {
  @IsString({ each: true })
  memberIds: string[];
}

export class DeleteGroupMembers {
  @IsString()
  @MinLength(3)
  memberIds: string;
}
