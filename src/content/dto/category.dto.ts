import { PartialType, PickType } from '@nestjs/swagger';
import { ContentCategory } from '../entities/category.entity';

export class CreateCategoryDto extends PickType(ContentCategory, [
  'name',
  'description',
  'slug',
  'parentId',
]) {}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}