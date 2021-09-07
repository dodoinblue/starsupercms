import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { APP_INFO } from './config/configurations';

@Controller()
@ApiTags('App Info')
export class AppController {
  @Get()
  getRoot() {
    return { ...APP_INFO, status: 'OK' };
  }
}
