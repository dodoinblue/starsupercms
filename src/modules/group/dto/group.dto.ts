import { PartialType, PickType } from '@nestjs/swagger';
import { Group } from '../entities/group.entity';

export class CreateGroupDto extends PickType(Group, ['name', 'description', 'parentId', 'type']) {}
export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
