import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemToTag } from './entities/item-to-tag.entity';
import { Item } from '../item/entities/item.entity';
import { Tag } from './entities/tag.entity';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Tag, ItemToTag])],
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
