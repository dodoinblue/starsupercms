import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service';

const services = [EmailService];

@Global()
@Module({
  providers: services,
  exports: services,
})
export class HelperModule {}
