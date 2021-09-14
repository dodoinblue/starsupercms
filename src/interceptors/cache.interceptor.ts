import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Reflector } from '@nestjs/core';
import {
  HttpAdapterHost,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  RequestMethod,
  CACHE_KEY_METADATA,
  Inject,
} from '@nestjs/common';
import { CacheService } from '../modules/cache/redis-cache.service';
import { REDIS } from '../config/configurations';
import { CACHE_KEY_BY_URL, MetadataKey } from '../constants/metadata';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheManager: CacheService,
    @Inject('Reflector') private readonly reflector: Reflector,
    @Inject('HttpAdapterHost') private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const call$ = next.handle();
    const key = this.trackBy(context);

    if (!key) {
      return call$;
    }

    const metaTTL = this.reflector.get<number>(MetadataKey.CUSTOM_CACHE_TTL, context.getHandler());
    const ttl = metaTTL || REDIS.ttl;

    try {
      const value = await this.cacheManager.get(key);
      if (value != null) {
        console.log(`cache ${key} hit`);
      } else {
        console.log(`cache ${key} miss`);
      }
      return value != null
        ? of(value)
        : call$.pipe(tap((response) => this.cacheManager.set(key, response, { ttl })));
    } catch (error) {
      return call$;
    }
  }

  /**
   * @function trackBy
   * @description Url will be used as cache key if CACHE_KEY_URL is set.
   * Hit rule: http -> GET  -> cachekey -> url
   */
  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest();
    const httpServer = this.httpAdapterHost.httpAdapter;
    const isHttpApp = Boolean(httpServer?.getRequestMethod);
    const isGetRequest =
      isHttpApp && httpServer.getRequestMethod(request) === RequestMethod[RequestMethod.GET];
    let cacheKey = this.reflector.get(CACHE_KEY_METADATA, context.getHandler());
    const requestUrl = httpServer.getRequestUrl(request);
    if (cacheKey === CACHE_KEY_BY_URL) {
      cacheKey = requestUrl;
    }
    const isMatchedCache = isHttpApp && isGetRequest && cacheKey;
    return isMatchedCache ? cacheKey : undefined;
  }
}
