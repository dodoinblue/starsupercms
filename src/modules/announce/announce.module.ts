import { Module } from '@nestjs/common';
import { AnnounceService } from './announce.service';
import { AnnounceController } from './announce.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announce } from './entities/announce.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Announce])],
  controllers: [AnnounceController],
  providers: [AnnounceService],
})
export class AnnounceModule {}
