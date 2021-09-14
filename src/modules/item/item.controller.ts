import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArticlePerms } from '../../constants/permissions';
import { Permission } from '../../decorators/permission.decorator';
import { attachUserIdToDto } from '../../utils/attach-uid';
import { ItemService } from './item.service';
import { CreateItemDto, QueryItemOptions, UpdateItemDto } from './dto/item.dto';
import { ApplyTagsDto, RemoveTagsQuery } from '../tag/dto/tag.dto';

@Controller('item')
@ApiTags('Item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @Permission([ArticlePerms.CREATE])
  create(@Body() dto: CreateItemDto, @Req() request) {
    attachUserIdToDto(request, dto);
    return this.itemService.create(dto);
  }

  @Get()
  findAll(@Query() options: QueryItemOptions) {
    return this.itemService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Patch(':id')
  @Permission([ArticlePerms.EDIT])
  update(@Param('id') id: string, @Body() dto: UpdateItemDto, @Req() request) {
    attachUserIdToDto(request, dto, ['updatedBy']);
    return this.itemService.update(id, dto);
  }

  @Delete(':id')
  @Permission([ArticlePerms.DELETE])
  remove(@Param('id') id: string) {
    return this.itemService.remove(id);
  }

  @Post(':id/tags')
  @Permission([ArticlePerms.EDIT])
  applyTags(@Param('id') itemId: string, @Body() { tagIds }: ApplyTagsDto, @Req() request) {
    const userId = request.custom.userId;
    return this.itemService.applyTags(itemId, tagIds, userId);
  }

  @Delete(':id/tags')
  @Permission([ArticlePerms.EDIT])
  async removeTags(@Param('id') itemId: string, @Query() { tagIds }: RemoveTagsQuery) {
    const tags = tagIds.split(',');
    return await this.itemService.removeTags(itemId, tags);
  }
}
