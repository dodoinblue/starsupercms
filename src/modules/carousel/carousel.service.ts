import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicQuery } from '../../common/dto/query-options.dto';
import { CreateCarouselDto, UpdateCarouselDto } from './dto/create-carousel.dto';
import { Carousel } from './entities/carousel.entity';

@Injectable()
export class CarouselService {
  constructor(
    @InjectRepository(Carousel)
    private carouselRepo: Repository<Carousel>,
  ) {}

  create(createCarouselDto: CreateCarouselDto) {
    const carousel = this.carouselRepo.create(createCarouselDto);
    return this.carouselRepo.save(carousel);
  }

  async findAll(options: BasicQuery) {
    const [items, total] = await this.carouselRepo.findAndCount(options);
    return { items, total };
  }

  findOne(id: string) {
    return this.carouselRepo.findOne(id);
  }

  update(id: string, dto: UpdateCarouselDto) {
    return this.carouselRepo.update(id, dto);
  }

  remove(id: string) {
    return this.carouselRepo.delete(id);
  }
}
