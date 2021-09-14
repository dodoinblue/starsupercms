import { PickType } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';
import { Comment } from '../entities/comment.entity';

export class CreateCommentDto extends PickType(Comment, [
  'content',
  'parentId',
  'extra',
  'itemId',
]) {}

export class UpdateCommentDto extends PickType(CreateCommentDto, ['content', 'extra']) {}

export class CommentTreeQuery {
  @IsString()
  @MinLength(3)
  @IsOptional()
  parentId?: string;
}
