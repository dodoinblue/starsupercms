import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Pagination } from '../common/dto/query-options.dto';
import { ContentCategoryPerms } from '../constants/permissions';
import { HttpCache } from '../decorators/http-cache.decorator';
import { Permission } from '../decorators/permission.decorator';
import { attachUserIdToDto } from '../utils/attach-uid';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Controller('content/category')
@ApiTags('ContentCategory')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Permission([ContentCategoryPerms.CREATE])
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() request) {
    attachUserIdToDto(request, createCategoryDto);
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @HttpCache({ ttl: 300 })
  findAll(@Query() options: Pagination) {
    return this.categoryService.findAll(options);
  }

  @Get(':id')
  @HttpCache({ ttl: 300 })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Get(':id/children')
  findChildren(@Param('id') id: string) {
    return this.categoryService.findChildren(id);
  }

  @Patch(':id')
  @Permission([ContentCategoryPerms.EDIT])
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Req() request) {
    attachUserIdToDto(request, updateCategoryDto);
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id/cascade')
  @Permission([ContentCategoryPerms.DELETE])
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
