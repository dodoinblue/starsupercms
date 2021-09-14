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
    private articleRepo: Repository<Item>,
    private readonly cacheManager: CacheService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const comment = this.commentRepo.create(createCommentDto);
    // TODO: insert articleId from parent comment
    const articleId = createCommentDto.itemId;
    comment.item = this.articleRepo.create({ id: articleId });
    const createResponse = await this.commentRepo.save(comment);
    return createResponse;
  }

  async findByArticleId(articleId: string, options: BasicQuery) {
    sortStringToFindOptions(options);
    const findResult = await this.commentRepo.find({
      where: {
        itemId: articleId,
      },
      ...options,
    });
    const total = this.countCommentByArticleId(articleId);
    return {
      items: findResult,
      total,
    };
  }

  async countCommentByArticleId(articleId: string) {
    let count = await this.cacheManager.HGET(
      `${REDIS_KEY.ArticlePrefix}@${articleId}`,
      REDIS_KEY.ArticleCommentField,
    );
    if (count == null) {
      count = await this.commentRepo.count({ itemId: articleId });
      await this.cacheManager.HSET(
        `${REDIS_KEY.ArticlePrefix}@${articleId}`,
        REDIS_KEY.ArticleCommentField,
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
      const articleId = comment.itemId;
      // this.cacheManager.HINCRBY(
      //   `${REDIS_KEY.ArticlePrefix}@${articleId}`,
      //   REDIS_KEY.ArticleCommentField,
      //   -1,
      // );
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
