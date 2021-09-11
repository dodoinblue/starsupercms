import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Article } from './entities/article.entity';
import { ContentCategory } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ContentCategory, Article])],
  controllers: [CategoryController, ArticleController],
  providers: [CategoryService, ArticleService],
})
export class ContentModule {}
