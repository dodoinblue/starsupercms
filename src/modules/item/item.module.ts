import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { Item } from './entities/item.entity';
import { ItemToTag } from '../tag/entities/item-to-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, ItemToTag])],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
