import { PartialType, PickType } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto extends PickType(Category, [
  'name',
  'description',
  'slug',
  'parentId',
]) {}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
