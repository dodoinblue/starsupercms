import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { BasicQuery } from '../../../common/dto/query-options.dto';
import { Role } from '../entity/role.entity';

export class CreateRoleDto extends PickType(Role, [
  'key',
  'name',
  'description',
  'status',
  'permissions',
]) {}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

export class AssignRoleMembers {
  @IsString({ each: true })
  memberIds: string[];
}

export class DeleteRoleMembers {
  @IsString()
  @MinLength(3)
  memberIds: string;
}

export class RoleQuery extends IntersectionType(
  BasicQuery,
  OmitType(UpdateRoleDto, ['permissions']),
) {}
