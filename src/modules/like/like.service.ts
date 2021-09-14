import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import lodash from 'lodash';
import { from, lastValueFrom, mergeMap, toArray } from 'rxjs';
import { Repository } from 'typeorm';
import { BasicQuery } from '../../common/dto/query-options.dto';
import { REDIS_KEY } from '../../constants/prefixes';
import { CacheService } from '../cache/redis-cache.service';
import { Like } from './entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepo: Repository<Like>,
    private readonly cacheManager: CacheService,
  ) {}

  async likeItem(accountId: string, itemId: string) {
    const like = this.likeRepo.create({ accountId, itemId: itemId });
    const likeResponse = await this.likeRepo.insert(like);
    return likeResponse;
  }

  async unlikeItem(accountId: string, itemId: string) {
    const like = this.likeRepo.create({ accountId, itemId: itemId });
    const removeResult = await this.likeRepo.delete(like);
    if (removeResult.affected === 1) {
      // this.cacheManager.HINCRBY(
      //   `${REDIS_KEY.ArticlePrefix}@${itemId}`,
      //   REDIS_KEY.ArticleLikeField,
      //   -1,
      // );
    }
  }

  async findLikedItems(accountId: string, options: BasicQuery) {
    const [items, total] = await this.likeRepo.findAndCount({
      where: {
        accountId,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['account'],
      ...options,
    });
    return { items, total };
  }

  async countItemLikes(itemId: string) {
    let count = await this.cacheManager.HGET(
      `${REDIS_KEY.ItemPrefix}@${itemId}`,
      REDIS_KEY.ItemLikeField,
    );
    if (count == null) {
      count = await this.likeRepo.count({ itemId: itemId });
      this.cacheManager.HSET(`${REDIS_KEY.ItemPrefix}@${itemId}`, REDIS_KEY.ItemLikeField, count);
    }
    return parseInt(count, 10);
  }

  async batchCountItemLikes(itemIds: string[]) {
    const counts = await lastValueFrom(
      from(itemIds).pipe(
        mergeMap((itemId) => {
          return this.countItemLikes(itemId);
        }, 4), // concurrency
        toArray(),
      ),
    );
    return lodash.zipObject(itemIds, counts);
  }
}
