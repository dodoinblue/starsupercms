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

  @Put('users/:userId/items/:items')
  @ApiOperation({ description: 'Like an item' })
  @Self()
  async likeItem(@Param('userId') userId: string, @Param('items') items: string) {
    return await this.likeService.likeItem(userId, items);
  }

  @Delete('users/:userId/items/:items')
  @ApiOperation({ description: 'Unlike an item' })
  @Self()
  async deleteLikeItem(@Param('userId') userId: string, @Param('items') items: string) {
    return await this.likeService.unlikeItem(userId, items);
  }

  @Get('users/:userId')
  @ApiOperation({ description: 'Get the list of liked items of a user.' })
  @Self()
  getUserLikes(@Param('userId') userId: string, @Query(SortToOrderPipe) options: BasicQuery) {
    return this.likeService.findLikedItems(userId, options);
  }

  @Get('items/:itemId')
  @ApiOperation({ description: 'Count likes of an item' })
  countItemLikes(@Param('itemId') itemId: string) {
    return this.likeService.countItemLikes(itemId);
  }

  @Get('items')
  @ApiOperation({ description: 'Count likes of items in batch' })
  batchCountItemLikes(@Query('commaSeparatedIds') itemIdsString: string) {
    const itemIds = itemIdsString.split(',');
    return this.likeService.batchCountItemLikes(itemIds);
  }
}
