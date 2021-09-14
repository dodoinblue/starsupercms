import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Item } from '../../item/entities/item.entity';
import { Tag } from './tag.entity';

@Entity()
export class ItemToTag extends BaseEntity {
  @IsString()
  @Column()
  itemId: string;

  @ManyToOne(() => Item, (item) => item.itemToTags)
  item: Item;

  @IsString()
  @Column()
  tagId: string;

  @ManyToOne(() => Tag, (tag) => tag.itemToTags)
  tag: Tag;
}
