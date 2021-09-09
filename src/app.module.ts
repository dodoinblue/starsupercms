import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { TYPEORM_DB } from './config/configurations';
import { appEnv } from './config/environment';
import { AuthModule } from './auth/auth.module';
import { HelperModule } from './helper/helper.module';
import { ProcessRequestContextMiddleware } from './middleware/process-request-context.middleware';

@Module({
  imports: [
    HelperModule,
    TypeOrmModule.forRoot({
      ...(TYPEORM_DB as any),
      logging: 'all',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: appEnv.isDevMode,
    }),
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProcessRequestContextMiddleware).forRoutes('*');
  }
}
