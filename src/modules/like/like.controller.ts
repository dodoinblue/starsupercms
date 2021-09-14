import { Controller, Get, Param, Delete, Put, Query } from '@nestjs/common';
import { LikeService } from './like.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Self } from '../../decorators/self.decorator';
import { BasicQuery } from '../../common/dto/query-options.dto';
import { SortToOrderPipe } from '../../pipes/sort-option.pipe';

@Controller('like')
@ApiTags('Like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Put('users/:userId/articles/:articleId')
  @ApiOperation({ description: 'Like an article' })
  @Self()
  async likeArticle(@Param('userId') userId: string, @Param('articleId') articleId: string) {
    return await this.likeService.likeArticle(userId, articleId);
  }

  @Delete('users/:userId/articles/:articleId')
  @ApiOperation({ description: 'Unlike an article' })
  @Self()
  async deleteLikeArticle(@Param('userId') userId: string, @Param('articleId') articleId: string) {
    return await this.likeService.unlikeArticle(userId, articleId);
  }

  @Get('users/:userId')
  @ApiOperation({ description: 'Get the list of liked articles of a user.' })
  @Self()
  getUserLikes(@Param('userId') userId: string, @Query(SortToOrderPipe) options: BasicQuery) {
    return this.likeService.findLikedArticles(userId, options);
  }

  @Get('articles/:articleId')
  @ApiOperation({ description: 'Count likes of an article' })
  countArticleLikes(@Param('articleId') articleId: string) {
    return this.likeService.countArticleLikes(articleId);
  }

  @Get('articles')
  @ApiOperation({ description: 'Count likes of articles in batch' })
  batchCountArticleLikes(@Query('commaSeparatedIds') articleIdsString: string) {
    const articleIds = articleIdsString.split(',');
    return this.likeService.batchCountArticleLikes(articleIds);
  }
}
