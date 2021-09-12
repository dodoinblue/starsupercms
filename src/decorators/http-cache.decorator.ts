import { CacheKey, SetMetadata } from '@nestjs/common';
import { CACHE_KEY_BY_URL, MetadataKey } from '../constants/metadata';

interface ICacheOption {
  ttl?: number;
  key?: string;
}

/**
 * Only Annotated http->get routes will be cached.
 * Special key `CACHE_KEY_BY_URL` means using url as key
 *
 * @function HttpCache
 * @example @HttpCache()
 * @example @HttpCache({ key: CACHE_KEY, ttl: 60 * 60 })
 */
export function HttpCache(option?: ICacheOption): MethodDecorator {
  const { key = CACHE_KEY_BY_URL, ttl } = option || {};

  return (_, __, descriptor: PropertyDescriptor) => {
    if (key) {
      CacheKey(key)(descriptor.value);
    }
    if (ttl) {
      SetMetadata(MetadataKey.CUSTOM_CACHE_TTL, ttl)(descriptor.value);
    }
    return descriptor;
  };
}
