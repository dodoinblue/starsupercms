import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BasicQuery } from '../../common/dto/query-options.dto';
import { ContentCategoryPerms } from '../../constants/permissions';
import { HttpCache } from '../../decorators/http-cache.decorator';
import { JwtUserId } from '../../decorators/jwt-user-id.decorator';
import { Permission } from '../../decorators/permission.decorator';
import { SortToOrderPipe } from '../../pipes/sort-option.pipe';
import { attachUserIdToDto } from '../../utils/attach-uid';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Controller('content/category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Permission([ContentCategoryPerms.CREATE])
  create(@Body() createCategoryDto: CreateCategoryDto, @JwtUserId() userId: string) {
    attachUserIdToDto(userId, createCategoryDto);
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  // @HttpCache({ ttl: 300 })
  findAll(@Query(SortToOrderPipe) options: BasicQuery) {
    return this.categoryService.findAll(options);
  }

  @Get(':id')
  // @HttpCache({ ttl: 300 })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Get(':id/children')
  findChildren(@Param('id') id: string) {
    return this.categoryService.findChildren(id);
  }

  @Patch(':id')
  @Permission([ContentCategoryPerms.EDIT])
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @JwtUserId() userId: string,
  ) {
    attachUserIdToDto(userId, updateCategoryDto);
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id/cascade')
  @Permission([ContentCategoryPerms.DELETE])
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
