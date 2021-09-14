import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { Pagination } from '../../../common/dto/query-options.dto';
import { Item } from '../entities/item.entity';

export class CreateItemDto extends PickType(Item, [
  'title',
  'slug',
  'content',
  'intro',
  'cover',
  'password',
  'keywords',
  'state',
  'categoryId',
]) {}

export class UpdateItemDto extends PartialType(CreateItemDto) {}

export class QueryItemOptions extends Pagination {
  @IsString()
  @MinLength(3)
  @IsOptional()
  categoryId?: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  sort?: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  @ApiPropertyOptional({ description: 'Comma separated keywords' })
  keywords?: string;
}
