import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { BasicQuery } from '../../common/dto/query-options.dto';
import { REDIS_KEY } from '../../constants/prefixes';
import { CustomError, ErrCodes } from '../../errors/errors';
import { sortStringToFindOptions } from '../../utils/sort-options';
import { CacheService } from '../cache/redis-cache.service';
import { Item } from '../item/entities/item.entity';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepo: TreeRepository<Comment>,
    @InjectRepository(Item)
    private itemRepo: Repository<Item>,
    private readonly cacheManager: CacheService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const comment = this.commentRepo.create(createCommentDto);
    // TODO: insert itemId from parent comment
    const itemId = createCommentDto.itemId;
    comment.item = this.itemRepo.create({ id: itemId });
    const createResponse = await this.commentRepo.save(comment);
    return createResponse;
  }

  async findByItemId(itemId: string, options: BasicQuery) {
    sortStringToFindOptions(options);
    const findResult = await this.commentRepo.find({
      where: {
        itemId: itemId,
      },
      ...options,
    });
    const total = this.countCommentByItemId(itemId);
    return {
      items: findResult,
      total,
    };
  }

  async countCommentByItemId(itemId: string) {
    let count = await this.cacheManager.HGET(
      `${REDIS_KEY.ItemPrefix}@${itemId}`,
      REDIS_KEY.ItemCommentField,
    );
    if (count == null) {
      count = await this.commentRepo.count({ itemId: itemId });
      await this.cacheManager.HSET(
        `${REDIS_KEY.ItemPrefix}@${itemId}`,
        REDIS_KEY.ItemCommentField,
        count,
      );
    }
    return parseInt(count || 0, 10);
  }

  async update(commentId: string, updateCommentDto: UpdateCommentDto, editorId: string) {
    const comment = await this.commentRepo.findOne(commentId);
    if (comment.createdBy !== editorId) {
      throw new CustomError(
        ErrCodes.FORBIDDEN,
        'Only creator of this data can edit',
        HttpStatus.FORBIDDEN,
      );
    }
    Object.assign(comment, updateCommentDto, { updatedBy: editorId });
    return this.commentRepo.update(commentId, comment);
  }

  async remove(commentId: string, editorId: string) {
    const comment = await this.commentRepo.findOne(commentId);
    if (comment.createdBy === editorId) {
      await this.commentRepo.softDelete({ id: commentId });
    } else {
      throw new CustomError(
        ErrCodes.FORBIDDEN,
        'Only creator of this data can delete',
        HttpStatus.FORBIDDEN,
      );
    }
    // TODO: decrease cache
  }

  async getCommentTreeByParentId(parentId: string) {
    const parent = this.commentRepo.create({ id: parentId });
    return await this.commentRepo.findDescendantsTree(parent);
  }
}
