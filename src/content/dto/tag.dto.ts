import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { Tag } from '../entities/tag.entity';

export class CreateTagDto extends PickType(Tag, ['value', 'description', 'type']) {}

export class UpdateTagDto extends PartialType(CreateTagDto) {}

export class ApplyTagsDto {
  @IsString({ each: true })
  tagIds: string[];
}

export class RemoveTagsQuery {
  @IsString()
  @MinLength(3)
  @ApiProperty({ description: 'Comma separated tagIds' })
  tagIds: string;
}
