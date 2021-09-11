import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from '../common/dto/query-options.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { attachUserIdToDto } from '../utils/attach-uid';
import { ArticleService } from './article.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';

@Controller('article')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() dto: CreateArticleDto, @Req() request) {
    attachUserIdToDto(request, dto);
    return this.articleService.create(dto);
  }

  @Get()
  findAll(@Query() options: Pagination) {
    return this.articleService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto, @Req() request) {
    attachUserIdToDto(request, dto, ['updatedBy']);
    return this.articleService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }
}
