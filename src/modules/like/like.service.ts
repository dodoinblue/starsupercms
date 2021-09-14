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

  async likeArticle(accountId: string, articleId: string) {
    const like = this.likeRepo.create({ accountId, itemId: articleId });
    const likeResponse = await this.likeRepo.insert(like);
    // this.cacheManager.HINCRBY(
    //   `${REDIS_KEY.ArticlePrefix}@${articleId}`,
    //   REDIS_KEY.ArticleLikeField,
    //   1,
    // );
    return likeResponse;
  }

  async unlikeArticle(accountId: string, articleId: string) {
    const like = this.likeRepo.create({ accountId, itemId: articleId });
    const removeResult = await this.likeRepo.delete(like);
    if (removeResult.affected === 1) {
      // this.cacheManager.HINCRBY(
      //   `${REDIS_KEY.ArticlePrefix}@${articleId}`,
      //   REDIS_KEY.ArticleLikeField,
      //   -1,
      // );
    }
  }

  async findLikedArticles(accountId: string, options: BasicQuery) {
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

  async countArticleLikes(articleId: string) {
    let count = await this.cacheManager.HGET(
      `${REDIS_KEY.ArticlePrefix}@${articleId}`,
      REDIS_KEY.ArticleLikeField,
    );
    if (count == null) {
      count = await this.likeRepo.count({ itemId: articleId });
      this.cacheManager.HSET(
        `${REDIS_KEY.ArticlePrefix}@${articleId}`,
        REDIS_KEY.ArticleLikeField,
        count,
      );
    }
    return parseInt(count, 10);
  }

  async batchCountArticleLikes(articleIds: string[]) {
    const counts = await lastValueFrom(
      from(articleIds).pipe(
        mergeMap((articleId) => {
          return this.countArticleLikes(articleId);
        }, 4), // concurrency
        toArray(),
      ),
    );
    return lodash.zipObject(articleIds, counts);
  }
}
