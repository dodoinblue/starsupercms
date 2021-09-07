import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { TYPEORM_DB } from './config/configurations';
import { appEnv } from './config/environment';
import { AuthModule } from './auth/auth.module';
import { HelperModule } from './helper/helper.module';

@Module({
  imports: [
    HelperModule,
    TypeOrmModule.forRoot({
      ...(TYPEORM_DB as any),
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: appEnv.isDevMode,
    }),
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
