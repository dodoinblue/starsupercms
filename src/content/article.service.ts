import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Like, Repository } from 'typeorm';
import { QueryArticleOptions } from './dto/article.dto';
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

  async findAll(options: QueryArticleOptions) {
    let queryCmd = this.articleRepo.createQueryBuilder('article');
    if (options.categoryId) {
      queryCmd = queryCmd.where({ categoryId: options.categoryId });
    }
    if (options.keywords) {
      const keywords = options.keywords.split(',');
      for (const word of keywords) {
        queryCmd = queryCmd.andWhere(
          new Brackets((subQb) =>
            subQb.where({ keywords: Like(`%${word}%`) }).orWhere({ title: Like(`%${word}%`) }),
          ),
        );
      }
    }
    if (options.sort) {
      const sorts = options.sort.split(',');
      for (const sort of sorts) {
        const desc = sort.charAt(0) === '-';
        const orderBy = desc ? sort.slice(1) : sort;
        queryCmd = queryCmd.orderBy(orderBy, desc ? 'DESC' : 'ASC');
      }
    }

    const [items, total] = await queryCmd.getManyAndCount();
    return {
      items,
      total,
    };
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
