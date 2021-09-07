import { Controller, Get } from '@nestjs/common';
import { APP_INFO } from './config/configurations';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return { ...APP_INFO, status: 'OK' };
  }
}
