import { Body, Controller, Get, Post, Query, Req, UploadedFile } from '@nestjs/common';
import { CreateMediaDto } from './dto/media.dto';
import { MediaService } from './media.service';
import { SaveUploadToLocal } from '../../decorators/local-file-upload.decorator';
import { ApiTags } from '@nestjs/swagger';
import { BasicQuery } from '../../common/dto/query-options.dto';

@Controller('media')
@ApiTags('Media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('images')
  @SaveUploadToLocal({ subFolderPrefix: 'media' })
  create(@Body() createMediaDto: CreateMediaDto, @UploadedFile('file') file: Express.Multer.File) {
    return this.mediaService.create({ ...createMediaDto, file });
  }

  @Post('avatars')
  @SaveUploadToLocal({ subFolderPrefix: 'avatar' })
  createAvatar(
    @Body() createMediaDto: CreateMediaDto,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    return this.mediaService.create({ ...createMediaDto, file });
  }

  @Get()
  findAll(@Query() options: BasicQuery) {
    return this.mediaService.findAll(options);
  }
}
