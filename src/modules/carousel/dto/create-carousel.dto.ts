import { PickType } from '@nestjs/swagger';
import { Carousel } from '../entities/carousel.entity';

export class CreateCarouselDto extends PickType(Carousel, ['items']) {}
export class UpdateCarouselDto extends CreateCarouselDto {}
