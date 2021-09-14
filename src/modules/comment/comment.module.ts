import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from '../item/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Item])],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
