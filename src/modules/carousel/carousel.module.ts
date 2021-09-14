import { Module } from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { CarouselController } from './carousel.controller';
import { Carousel } from './entities/carousel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Carousel])],
  controllers: [CarouselController],
  providers: [CarouselService],
})
export class CarouselModule {}
