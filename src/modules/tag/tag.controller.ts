import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiTags } from '@nestjs/swagger';
import { Pagination } from '../../common/dto/query-options.dto';
import { TagPerms } from '../../constants/permissions';
import { Permission } from '../../decorators/permission.decorator';
import { attachUserIdToDto } from '../../utils/attach-uid';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';

@Controller('tag')
@ApiTags('Tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @Permission([TagPerms.CREATE])
  create(@Body() createTagDto: CreateTagDto, @Req() request) {
    attachUserIdToDto(request, createTagDto);
    return this.tagService.create(createTagDto);
  }

  @Get()
  findAll(@Query() options: Pagination) {
    return this.tagService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(id);
  }

  @Patch(':id')
  @Permission([TagPerms.EDIT])
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto, @Req() request) {
    attachUserIdToDto(request, updateTagDto, ['updatedBy']);
    return this.tagService.update(id, updateTagDto);
  }

  @Delete(':id')
  @Permission([TagPerms.DELETE])
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}
