import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BasicQuery } from '../../common/dto/query-options.dto';
import { JwtUserId } from '../../decorators/jwt-user-id.decorator';
import { JwtGuard } from '../../guards/jwt.guard';
import { SortToOrderPipe } from '../../pipes/sort-option.pipe';
import { attachUserIdToDto } from '../../utils/attach-uid';
import { CommentService } from './comment.service';
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto';

@Controller('comment')
@ApiTags('Comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  create(@Body() createCommentDto: CreateCommentDto, @JwtUserId() userId: string) {
    attachUserIdToDto(userId, createCommentDto);
    return this.commentService.create(createCommentDto);
  }

  @Get('items/:itemId')
  findByItemId(@Param('itemId') itemId: string, @Query(SortToOrderPipe) options: BasicQuery) {
    return this.commentService.findByItemId(itemId, options);
  }

  @Get(':commentId')
  findCommentTree(@Param('commentId') commentId: string) {
    return this.commentService.getCommentTreeByParentId(commentId);
  }

  @Patch(':commentId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @JwtUserId() userId: string,
  ) {
    return this.commentService.update(commentId, updateCommentDto, userId);
  }

  @Delete(':commentId')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Soft delete comment so child comments will be preserved.' })
  remove(@Param('commentId') commentId: string, @JwtUserId() userId: string) {
    return this.commentService.remove(commentId, userId);
  }
}
