import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Pagination } from '../common/dto/query-options.dto';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepo: TreeRepository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const tag = this.tagRepo.create(createTagDto);
    return await this.tagRepo.save(tag);
  }

  async findAll(options: Pagination) {
    return await this.tagRepo.findAndCount(options);
  }

  async findOne(id: string) {
    return await this.tagRepo.findOne(id);
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = this.tagRepo.create(updateTagDto);
    return await this.tagRepo.update(id, tag);
  }

  async remove(id: string) {
    return await this.tagRepo.delete(id);
  }
}
