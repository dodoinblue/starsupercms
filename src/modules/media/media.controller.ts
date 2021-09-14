import { Body, Controller, Post, UploadedFile } from '@nestjs/common';
import { CreateMediaDto } from './dto/media.dto';
import { MediaService } from './media.service';
import { SaveUploadToLocal } from '../../decorators/local-file-upload.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('media')
@ApiTags('Media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @SaveUploadToLocal('file')
  create(@Body() createMediaDto: CreateMediaDto, @UploadedFile('file') file: Express.Multer.File) {
    return this.mediaService.create({ ...createMediaDto, file });
  }
}
