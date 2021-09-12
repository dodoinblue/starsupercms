import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { RedisClient } from 'redis';
import { promisify } from 'util';

export interface ICacheManager {
  store: {
    getClient(): RedisClient;
  };
  get(key: string): any;
  set(key: string, value: string, options?: { ttl: number }): any;
}

@Injectable()
export class CacheService {
  private cache!: ICacheManager;

  constructor(@Inject(CACHE_MANAGER) cache: ICacheManager) {
    this.cache = cache;
    this.redisClient.on('ready', () => {
      console.info('Redis ready');
    });
  }

  private get redisClient(): RedisClient {
    return this.cache.store.getClient();
  }

  private get checkCacheServiceAvailable(): boolean {
    return this.redisClient.connected;
  }

  public get<T>(key: string): Promise<T> {
    if (!this.checkCacheServiceAvailable) {
      return Promise.reject('Redis client not ready');
    }
    return this.cache.get(key);
  }

  public set<T>(key: string, value: any, options?: { ttl: number }): Promise<T> {
    if (!this.checkCacheServiceAvailable) {
      return Promise.reject('Redis client not ready');
    }
    return this.cache.set(key, value, options);
  }

  public HGET(key: string, field: string) {
    if (!this.checkCacheServiceAvailable) {
      return Promise.reject('Redis client not ready');
    }
    const cmdPromise = promisify(this.redisClient.HGET).bind(this.redisClient);
    return cmdPromise(key, field);
  }

  public HSET(key: string, field: string, value: any) {
    if (!this.checkCacheServiceAvailable) {
      return Promise.reject('Redis client not ready');
    }
    const cmdPromise = promisify(this.redisClient.HSET).bind(this.redisClient);
    return cmdPromise(key, field, value);
  }

  public HINCRBY(key: string, field: string, by: number) {
    if (!this.checkCacheServiceAvailable) {
      return Promise.reject('Redis client not ready');
    }
    const cmdPromise = promisify(this.redisClient.HINCRBY).bind(this.redisClient);
    return cmdPromise(key, field, by);
  }
}
