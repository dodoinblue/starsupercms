import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(3)
  key: string;

  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  description: string;
}

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
