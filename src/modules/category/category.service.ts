import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import lodash from 'lodash';
import { IsNull, TreeRepository } from 'typeorm';
import { BasicTreeQuery } from '../../common/dto/query-options.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: TreeRepository<Category>,
  ) {}

  async create(createCategoryDto: Partial<Category>) {
    const category = await this.categoryRepo.create(createCategoryDto);
    if (createCategoryDto.parentId) {
      category.parent = this.categoryRepo.create({ id: createCategoryDto.parentId });
    }
    return this.categoryRepo.save(category);
  }

  async findAll(options: BasicTreeQuery) {
    const basicOptions = lodash.pick(options, ['skip', 'take', 'order']);
    const whereOptions = options.parentId ? { parentId: options.parentId } : { parentId: IsNull() };

    const [items, total] = await this.categoryRepo.findAndCount({
      where: whereOptions,
      ...basicOptions,
    });
    return { items, total };
  }

  async findOne(id: string) {
    return await this.categoryRepo.findOne(id);
  }

  async findChildren(id: string) {
    const parent = this.categoryRepo.create({ id });
    return await this.categoryRepo.findDescendantsTree(parent);
  }

  async update(id: string, updateCategoryDto: Partial<Category>) {
    return await this.categoryRepo.update({ id }, updateCategoryDto);
  }

  async remove(id: string) {
    return await this.categoryRepo.delete(id);
  }
}
