import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import lodash from 'lodash';
import { IsNull, TreeRepository } from 'typeorm';
import { BasicTreeQuery } from '../../common/dto/query-options.dto';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepo: TreeRepository<Group>,
  ) {}

  create(dto: CreateGroupDto) {
    const group = this.groupRepo.create(dto);
    if (dto.parentId) {
      group.parent = this.groupRepo.create({ id: dto.parentId });
    }
    return this.groupRepo.save(group);
  }

  async findAll(options: BasicTreeQuery) {
    const basicOptions = lodash.pick(options, ['skip', 'take', 'order']);
    const whereOptions = options.parentId ? { parentId: options.parentId } : { parentId: IsNull() };

    const [items, total] = await this.groupRepo.findAndCount({
      where: whereOptions,
      ...basicOptions,
    });
    return { items, total };
  }

  async findOne(id: string) {
    return await this.groupRepo.findOne(id);
  }

  async findChildren(id: string) {
    const parent = this.groupRepo.create({ id });
    return await this.groupRepo.findDescendantsTree(parent);
  }

  update(id: string, updateGroupDto: UpdateGroupDto) {
    return this.groupRepo.update({ id }, updateGroupDto);
  }

  remove(id: string) {
    return this.groupRepo.delete(id);
  }
}
