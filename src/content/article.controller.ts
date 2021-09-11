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
import { ArticlePerms } from '../constants/permissions';
import { Permission } from '../decorators/permission.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { attachUserIdToDto } from '../utils/attach-uid';
import { ArticleService } from './article.service';
import { CreateArticleDto, QueryArticleOptions, UpdateArticleDto } from './dto/article.dto';

@Controller('article')
@ApiTags('Article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiBearerAuth()
  @Permission([ArticlePerms.CREATE])
  @UseGuards(JwtGuard)
  create(@Body() dto: CreateArticleDto, @Req() request) {
    attachUserIdToDto(request, dto);
    return this.articleService.create(dto);
  }

  @Get()
  findAll(@Query() options: QueryArticleOptions) {
    return this.articleService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Permission([ArticlePerms.EDIT])
  @UseGuards(JwtGuard)
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto, @Req() request) {
    attachUserIdToDto(request, dto, ['updatedBy']);
    return this.articleService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Permission([ArticlePerms.DELETE])
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string) {
    return this.articleService.remove(id);
  }
}
