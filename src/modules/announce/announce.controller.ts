import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BasicQuery } from '../../common/dto/query-options.dto';
import { AnnouncePerms } from '../../constants/permissions';
import { HttpCache } from '../../decorators/http-cache.decorator';
import { Permission } from '../../decorators/permission.decorator';
import { SortToOrderPipe } from '../../pipes/sort-option.pipe';
import { AnnounceService } from './announce.service';
import { CreateAnnounceDto, UpdateAnnounceDto } from './dto/announce.dto';

@Controller('announce')
@ApiTags('Announce')
export class AnnounceController {
  constructor(private readonly announceService: AnnounceService) {}

  @Post()
  @Permission([AnnouncePerms.CREATE])
  create(@Body() createAnnounceDto: CreateAnnounceDto) {
    return this.announceService.create(createAnnounceDto);
  }

  @Get()
  @Permission([AnnouncePerms.LIST])
  findAll(@Query(SortToOrderPipe) options: BasicQuery) {
    return this.announceService.findAll(options);
  }

  @Get('active')
  @HttpCache({ ttl: 60 })
  findAllActive(@Query(SortToOrderPipe) options: BasicQuery) {
    return this.announceService.findActive(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.announceService.findOne(id);
  }

  @Patch(':id')
  @Permission([AnnouncePerms.EDIT])
  update(@Param('id') id: string, @Body() updateAnnounceDto: UpdateAnnounceDto) {
    return this.announceService.update(id, updateAnnounceDto);
  }

  @Delete(':id')
  @Permission([AnnouncePerms.DELETE])
  remove(@Param('id') id: string) {
    return this.announceService.remove(id);
  }
}
