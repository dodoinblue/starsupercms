import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import express from 'express';
import compression from 'compression';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { APP, APP_INFO } from './config/configurations';
import { appEnv } from './config/environment';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('StarSuper CMS')
    .setDescription('StarSuper CMS API description')
    .setVersion(APP_INFO.version)
    .addServer(`http://${APP.host}:${APP.port}/api/v1`, 'local server')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc/v1', app, document);

  // Set prefix for APIs
  app.setGlobalPrefix('api/v1');
  await app.listen(APP.port);
}

bootstrap().then(() => {
  console.info(
    `${APP_INFO.name} (${appEnv.value}) is running. Visit http://${APP.host}:${APP.port}/doc/v1`,
  );
});
