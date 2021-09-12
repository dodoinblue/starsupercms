import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ArticleToTag } from './entities/article-tag.entity';
import { Article } from './entities/article.entity';
import { ContentCategory } from './entities/category.entity';
import { Tag } from './entities/tag.entity';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContentCategory, Article, Tag, ArticleToTag]), LikeModule, CommentModule],
  controllers: [CategoryController, ArticleController, TagController],
  providers: [CategoryService, ArticleService, TagService],
})
export class ContentModule {}
