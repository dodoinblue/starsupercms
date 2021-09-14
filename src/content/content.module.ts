import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from '../modules/item/item.controller';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ArticleToTag } from './entities/article-tag.entity';
import { Article } from '../modules/item/entities/item.entity';
import { ContentCategory } from './entities/category.entity';
import { Tag } from './entities/tag.entity';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentCategory, Article, Tag, ArticleToTag]),
    LikeModule,
    CommentModule,
  ],
  controllers: [CategoryController, ArticleController, TagController],
  providers: [CategoryService, TagService],
})
export class ContentModule {}
