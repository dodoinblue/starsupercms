import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Like, Repository } from 'typeorm';
import { ItemToTag } from '../tag/entities/item-to-tag.entity';
import { QueryItemOptions } from './dto/item.dto';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepo: Repository<Item>,

    @InjectRepository(ItemToTag)
    private a2tRepo: Repository<ItemToTag>,
  ) {}

  create(dto: Partial<Item>) {
    const item = this.itemRepo.create(dto);
    return this.itemRepo.save(item);
  }

  async findAll(options: QueryItemOptions) {
    let queryCmd = this.itemRepo.createQueryBuilder('item');
    if (options.categoryId) {
      queryCmd = queryCmd.where({ categoryId: options.categoryId });
    }
    if (options.keywords) {
      const keywords = options.keywords.split(',');
      for (const word of keywords) {
        queryCmd = queryCmd.andWhere(
          new Brackets((subQb) =>
            subQb.where({ keywords: Like(`%${word}%`) }).orWhere({ title: Like(`%${word}%`) }),
          ),
        );
      }
    }
    if (options.sort) {
      const sorts = options.sort.split(',');
      for (const sort of sorts) {
        const desc = sort.charAt(0) === '-';
        const orderBy = desc ? sort.slice(1) : sort;
        queryCmd = queryCmd.orderBy(orderBy, desc ? 'DESC' : 'ASC');
      }
    }

    const [items, total] = await queryCmd.getManyAndCount();
    return {
      items,
      total,
    };
  }

  findOne(id: string) {
    return this.itemRepo.findOne(id);
  }

  async update(id: string, dto: Partial<Item>) {
    const item = this.itemRepo.create(dto);
    return await this.itemRepo.update(id, item);
  }

  remove(id: string) {
    return this.itemRepo.delete(id);
  }

  async applyTags(itemId: string, tagIds: string[], userId: string) {
    const itemToTags = tagIds.map((tagId) =>
      this.a2tRepo.create({ tagId, itemId: itemId, createdBy: userId, updatedBy: userId }),
    );
    return await this.a2tRepo.save(itemToTags);
  }

  async removeTags(itemId: string, tagIds: string[]) {
    return await this.a2tRepo.delete({ itemId: itemId, tagId: In(tagIds) });
  }
}
