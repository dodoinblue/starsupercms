import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Pagination } from '../common/dto/query-options.dto';
import { ContentCategory } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(ContentCategory)
    private categoryRepo: TreeRepository<ContentCategory>,
  ) {}

  async create(createCategoryDto: Partial<ContentCategory>) {
    const category = await this.categoryRepo.create(createCategoryDto);
    if (createCategoryDto.parentId) {
      category.parent = this.categoryRepo.create({ id: createCategoryDto.parentId });
    }
    return this.categoryRepo.save(category);
  }

  async findAll(options: Pagination) {
    return await this.categoryRepo.find(options);
  }

  async findOne(id: string) {
    return await this.categoryRepo.findOne(id);
  }

  async findChildren(id: string) {
    const parent = this.categoryRepo.create({ id });
    return await this.categoryRepo.findDescendantsTree(parent);
  }

  async update(id: string, updateCategoryDto: Partial<ContentCategory>) {
    return await this.categoryRepo.update({ id }, updateCategoryDto);
  }

  async remove(id: string) {
    return await this.categoryRepo.delete(id);
  }
}
