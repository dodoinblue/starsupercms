import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { TYPEORM_DB } from './config/configurations';
import { appEnv } from './config/environment';
import { AuthModule } from './modules/auth/auth.module';
import { HelperModule } from './helper/helper.module';
import { ProcessRequestContextMiddleware } from './middleware/process-request-context.middleware';
import { ProfilesModule } from './modules/profile/profile.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpCacheInterceptor } from './interceptors/cache.interceptor';
import { MediaModule } from './modules/media/media.module';
import { ItemModule } from './modules/item/item.module';
import { TagModule } from './modules/tag/tag.module';
import { CategoryModule } from './modules/category/category.module';
import { CacheModule } from './modules/cache/redis-cache.module';
import { AnnounceModule } from './modules/announce/announce.module';
import { CarouselModule } from './modules/carousel/carousel.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    HelperModule,
    CacheModule,
    TypeOrmModule.forRoot({
      ...(TYPEORM_DB as any),
      logging: 'all',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: appEnv.isDevMode,
    }),
    AuthModule,
    ProfilesModule,
    MediaModule,
    ItemModule,
    TagModule,
    CategoryModule,
    AnnounceModule,
    CarouselModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_INTERCEPTOR, useClass: HttpCacheInterceptor }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProcessRequestContextMiddleware).forRoutes('*');
  }
}
