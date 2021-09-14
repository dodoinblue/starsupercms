import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BasicQuery } from '../../common/dto/query-options.dto';
import { CarouselPerms } from '../../constants/permissions';
import { JwtUserId } from '../../decorators/jwt-user-id.decorator';
import { Permission } from '../../decorators/permission.decorator';
import { SortToOrderPipe } from '../../pipes/sort-option.pipe';
import { attachUserIdToDto } from '../../utils/attach-uid';
import { CarouselService } from './carousel.service';
import { CreateCarouselDto, UpdateCarouselDto } from './dto/create-carousel.dto';

@Controller('carousel')
@ApiTags('Carousel')
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Post()
  @Permission([CarouselPerms.CREATE])
  create(@Body() createCarouselDto: CreateCarouselDto, @JwtUserId() userId: string) {
    attachUserIdToDto(userId, createCarouselDto);
    return this.carouselService.create(createCarouselDto);
  }

  @Get()
  @Permission([CarouselPerms.LIST])
  findAll(@Query(SortToOrderPipe) options: BasicQuery) {
    return this.carouselService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carouselService.findOne(id);
  }

  @Patch(':id')
  @Permission([CarouselPerms.EDIT])
  update(
    @Param('id') id: string,
    @Body() updateCarouselDto: UpdateCarouselDto,
    @JwtUserId() userId: string,
  ) {
    attachUserIdToDto(userId, updateCarouselDto, ['updatedBy']);
    return this.carouselService.update(id, updateCarouselDto);
  }

  @Delete(':id')
  @Permission([CarouselPerms.DELETE])
  remove(@Param('id') id: string) {
    return this.carouselService.remove(id);
  }
}
