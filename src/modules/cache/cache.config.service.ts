import redisStore from 'cache-manager-redis-store';
import { ClientOpts, RetryStrategyOptions } from 'redis';
import { CacheModuleOptions, CacheOptionsFactory, Injectable } from '@nestjs/common';
import { REDIS } from '../config/configurations';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  public retryStrategy(options: RetryStrategyOptions) {
    console.error('Redis error', options.error);

    if (options?.error?.code === 'ECONNREFUSED') {
      return new Error('Redis connection refused.');
    }
    if (options.total_retry_time > 1000 * 60) {
      return new Error('Redis used total retry time.');
    }
    if (options.attempt > 6) {
      return new Error('Redis reached retry limit.');
    }

    return Math.min(options.attempt * 100, 3000);
  }

  public createCacheOptions(): CacheModuleOptions {
    const redisOptions: ClientOpts = {
      host: REDIS.host as string,
      port: REDIS.port as number,
      retry_strategy: this.retryStrategy.bind(this),
    };
    if (REDIS.password) {
      redisOptions.password = REDIS.password;
    }
    return {
      store: redisStore,
      ttl: REDIS.ttl,
      is_cacheable_value: () => true,
      ...redisOptions,
    };
  }
}
