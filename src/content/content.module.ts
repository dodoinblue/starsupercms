import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from '../modules/item/item.controller';
import { CategoryService } from '../modules/category/category.service';
import { ItemToTag } from '../modules/tag/entities/item-to-tag.entity';
import { Item } from '../modules/item/entities/item.entity';
import { Category } from '../modules/category/entities/category.entity';
import { Tag } from '../modules/tag/entities/tag.entity';
import { TagService } from '../modules/tag/tag.service';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Item, Tag, ItemToTag]), LikeModule, CommentModule],
})
export class ContentModule {}
