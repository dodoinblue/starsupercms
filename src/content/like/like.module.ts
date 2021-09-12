import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { Like } from './entities/like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
