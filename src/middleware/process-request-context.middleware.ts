import { Injectable, NestMiddleware } from '@nestjs/common';
import express from 'express';
import { nanoid } from '../utils/nanoid';

@Injectable()
export class ProcessRequestContextMiddleware implements NestMiddleware {
  use(request: express.Request | any, response: Response, next) {
    const ip = (
      request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.socket.remoteAddress ||
      request.ip ||
      request.ips[0]
    ).replace('::ffff:', '');

    const ua = request.headers['user-agent'];
    const requestId = request.headers['x-request-id'] || nanoid(24);

    // mount to request
    if (!request.custom || typeof request.custom !== 'object') {
      request.custom = {};
    }
    Object.assign(request.custom, { ua, requestId, ip });

    return next();
  }
}
