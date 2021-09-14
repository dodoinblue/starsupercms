import { PickType } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';
import { Pagination } from '../../../common/dto/query-options.dto';
import { Comment } from '../entities/comment.entity';

export class CreateCommentDto extends PickType(Comment, [
  'content',
  'parentId',
  'extra',
  'articleId',
]) {}

export class UpdateCommentDto extends PickType(CreateCommentDto, ['content', 'extra']) {}

export class CommentFlatQuery extends Pagination {
  @IsString()
  @MinLength(3)
  @IsOptional()
  sort?: string;
}

export class CommentTreeQuery {
  @IsString()
  @MinLength(3)
  @IsOptional()
  parentId?: string;
}
