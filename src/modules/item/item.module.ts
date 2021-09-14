import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleController } from './item.controller';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { ItemToTag } from '../tag/entities/item-to-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, ItemToTag])],
  controllers: [ArticleController],
  providers: [ItemService],
})
export class ItemModule {}
