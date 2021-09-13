import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMediaDto } from './dto/media.dto';
import { Media } from './entities/media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepo: Repository<Media>,
  ) {}
  create(createMediaDto: CreateMediaDto & { file: Express.Multer.File }) {
    const media = this.mediaRepo.create({
      description: createMediaDto.description,
      uri: createMediaDto.file.filename,
      type: createMediaDto.file.mimetype,
    });
    return this.mediaRepo.save(media);
  }
}
