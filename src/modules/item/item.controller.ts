import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArticlePerms } from '../../constants/permissions';
import { Permission } from '../../decorators/permission.decorator';
import { attachUserIdToDto } from '../../utils/attach-uid';
import { ItemService } from './item.service';
import { CreateItemDto, QueryItemOptions, UpdateItemDto } from './dto/item.dto';
import { ApplyTagsDto, RemoveTagsQuery } from '../tag/dto/tag.dto';

@Controller('article')
@ApiTags('Article')
export class ArticleController {
  constructor(private readonly articleService: ItemService) {}

  @Post()
  @Permission([ArticlePerms.CREATE])
  create(@Body() dto: CreateItemDto, @Req() request) {
    attachUserIdToDto(request, dto);
    return this.articleService.create(dto);
  }

  @Get()
  findAll(@Query() options: QueryItemOptions) {
    return this.articleService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Patch(':id')
  @Permission([ArticlePerms.EDIT])
  update(@Param('id') id: string, @Body() dto: UpdateItemDto, @Req() request) {
    attachUserIdToDto(request, dto, ['updatedBy']);
    return this.articleService.update(id, dto);
  }

  @Delete(':id')
  @Permission([ArticlePerms.DELETE])
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }

  @Post(':id/tags')
  @Permission([ArticlePerms.EDIT])
  applyTags(@Param('id') articleId: string, @Body() { tagIds }: ApplyTagsDto, @Req() request) {
    const userId = request.custom.userId;
    return this.articleService.applyTags(articleId, tagIds, userId);
  }

  @Delete(':id/tags')
  @Permission([ArticlePerms.EDIT])
  async removeTags(@Param('id') articleId: string, @Query() { tagIds }: RemoveTagsQuery) {
    const tags = tagIds.split(',');
    return await this.articleService.removeTags(articleId, tags);
  }
}
