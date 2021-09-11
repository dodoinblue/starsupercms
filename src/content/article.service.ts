import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from '../common/dto/query-options.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepo: Repository<Article>,
  ) {}

  create(dto: Partial<Article>) {
    const article = this.articleRepo.create(dto);
    return this.articleRepo.save(article);
  }

  findAll(options: Pagination) {
    return this.articleRepo.findAndCount({
      select: ['id', 'title', 'intro', 'cover', 'keywords'],
      ...options,
    });
  }

  findOne(id: string) {
    return this.articleRepo.findOne(id);
  }

  async update(id: string, dto: Partial<Article>) {
    const article = this.articleRepo.create(dto);
    return await this.articleRepo.update(id, article);
  }

  remove(id: string) {
    return this.articleRepo.delete(id);
  }
}
