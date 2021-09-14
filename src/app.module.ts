import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { TYPEORM_DB } from './config/configurations';
import { appEnv } from './config/environment';
import { AuthModule } from './auth/auth.module';
import { HelperModule } from './helper/helper.module';
import { ProcessRequestContextMiddleware } from './middleware/process-request-context.middleware';
import { ProfilesModule } from './profile/profile.module';
import { ContentModule } from './content/content.module';
import { CacheModule } from './cache/redis-cache.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { HttpCacheInterceptor } from './interceptors/cache.interceptor';
import { MediaModule } from './media/media.module';
import { ItemModule } from './modules/item/item.module';
import { TagModule } from './modules/tag/tag.module';
import { CategoryModule } from './modules/category/category.module';

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
    ContentModule,
    MediaModule,
    ItemModule,
    TagModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_INTERCEPTOR, useClass: HttpCacheInterceptor }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProcessRequestContextMiddleware).forRoutes('*');
  }
}
