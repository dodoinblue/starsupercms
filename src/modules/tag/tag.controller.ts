import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TagService } from './tag.service';
import { ApiTags } from '@nestjs/swagger';
import { BasicQuery } from '../../common/dto/query-options.dto';
import { TagPerms } from '../../constants/permissions';
import { Permission } from '../../decorators/permission.decorator';
import { attachUserIdToDto } from '../../utils/attach-uid';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import { SortToOrderPipe } from '../../pipes/sort-option.pipe';
import { JwtUserId } from '../../decorators/jwt-user-id.decorator';

@Controller('tag')
@ApiTags('Tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @Permission([TagPerms.CREATE])
  create(@Body() createTagDto: CreateTagDto, @JwtUserId() userId: string) {
    attachUserIdToDto(userId, createTagDto);
    return this.tagService.create(createTagDto);
  }

  @Get()
  findAll(@Query(SortToOrderPipe) options: BasicQuery) {
    return this.tagService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(id);
  }

  @Patch(':id')
  @Permission([TagPerms.EDIT])
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto, @JwtUserId() userId: string) {
    attachUserIdToDto(userId, updateTagDto, ['updatedBy']);
    return this.tagService.update(id, updateTagDto);
  }

  @Delete(':id')
  @Permission([TagPerms.DELETE])
  remove(@Param('id') id: string) {
    return this.tagService.remove(id);
  }
}
