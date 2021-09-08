import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import express from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<express.Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      errCode: exception.name,
      message: exception.message,
    });
  }
}
