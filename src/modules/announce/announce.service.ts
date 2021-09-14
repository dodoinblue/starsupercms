import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Pagination } from '../../common/dto/query-options.dto';
import { CreateAnnounceDto, UpdateAnnounceDto } from './dto/announce.dto';
import { Announce } from './entities/announce.entity';

@Injectable()
export class AnnounceService {
  constructor(
    @InjectRepository(Announce)
    private announceRepo: Repository<Announce>,
  ) {}

  async create(dto: CreateAnnounceDto) {
    const announce = this.announceRepo.create(dto);
    return await this.announceRepo.save(announce);
  }

  async findAll(options: Pagination) {
    const [items, total] = await this.announceRepo.findAndCount(options);
    return {
      items,
      total,
    };
  }

  async findActive(options: Pagination) {
    const [items, total] = await this.announceRepo.findAndCount({
      where: {
        status: 0,
        expireAt: LessThan(Date.now()),
      },
      ...options,
    });
    return {
      items,
      total,
    };
  }

  findOne(id: string) {
    return this.announceRepo.findOne(id);
  }

  update(id: string, dto: UpdateAnnounceDto) {
    const announce = this.announceRepo.create(dto);
    return this.announceRepo.update(id, announce);
  }

  remove(id: string) {
    return this.announceRepo.delete(id);
  }
}
