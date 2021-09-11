import { ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';
import { Pagination } from '../../common/dto/query-options.dto';
import { Article } from '../entities/article.entity';

export class CreateArticleDto extends PickType(Article, [
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

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}

export class QueryArticleOptions extends Pagination {
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
