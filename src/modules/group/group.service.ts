import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import lodash from 'lodash';
import { Connection, EntityManager, IsNull, Like, TreeRepository } from 'typeorm';
import { BasicTreeQuery } from '../../common/dto/query-options.dto';
import { CustomError, ErrCodes } from '../../errors/errors';
import { CreateGroupDto, GroupQueryOptions, UpdateGroupDto } from './dto/group.dto';
import { Group } from './entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepo: TreeRepository<Group>,
    private connection: Connection,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {
    groupRepo.metadata.columns = groupRepo.metadata.columns.map((x) => {
      if (x.databaseName === 'mpath') {
        x.isVirtual = false;
      }
      return x;
    });
  }

  create(dto: CreateGroupDto) {
    const group = this.groupRepo.create(dto);
    if (dto.parentId) {
      group.parent = this.groupRepo.create({ id: dto.parentId });
    }
    return this.groupRepo.save(group);
  }

  async findAll(options: GroupQueryOptions) {
    const { tree = false, parentId = null } = options;
    if (tree) {
      if (parentId) {
        const parent = await this.groupRepo.findOne(parentId);
        if (!parent) {
          throw new NotFoundException();
        }
        const item = await this.groupRepo.findDescendantsTree(parent);
        // Keep the result in the same format in all cases
        return { items: [item], total: 1 };
      } else {
        const items = await this.groupRepo.findTrees();
        return {
          items,
          total: items.length,
        };
      }
    } else {
      const basicOptions = lodash.pick(options, ['skip', 'take', 'order']);
      let whereOptions: any = lodash.omit(options, ['skip', 'take', 'order']);
      if (lodash.isEmpty(whereOptions)) {
        whereOptions = options.parentId ? { parentId: options.parentId } : { parentId: IsNull() };
      }
      const [items, total] = await this.groupRepo.findAndCount({
        where: whereOptions,
        ...basicOptions,
      });
      return { items, total };
    }
  }

  async findOne(id: string) {
    return await this.groupRepo.findOne(id);
  }

  async findChildren(id: string) {
    const parent = this.groupRepo.create({ id });
    return await this.groupRepo.findDescendantsTree(parent);
  }

  async update(id: string, dto: Partial<Group>) {
    const newParent = await this.groupRepo.findOne(dto.parentId);
    const groupUnderEdit = await this.groupRepo.findOne(id);
    if (newParent.mpath.includes(id)) {
      throw new BadRequestException('circular tree path');
    }
    const oldPath = groupUnderEdit.mpath;
    const newPath = `${newParent.mpath}${id}.`;

    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    try {
      await runner.manager.update(Group, { id }, dto);
      await runner.query(
        'UPDATE `group` SET mpath = REPLACE(mpath, ?, ?), ' +
          'updatedAt = current_time(), updatedBy = ? WHERE `mpath` LIKE ?',
        [oldPath, newPath, dto.updatedBy, oldPath + '%'],
      );
      await runner.commitTransaction();
    } catch (error) {
      await runner.rollbackTransaction();
      throw error;
    } finally {
      await runner.release();
    }
  }

  async remove(id: string) {
    try {
      return await this.groupRepo.delete(id);
    } catch (error) {
      if (
        error.name === 'QueryFailedError' &&
        error.message.includes('foreign key constraint fails') &&
        error.message.includes('parentId')
      ) {
        throw new CustomError(
          ErrCodes.DELETE_FAIL_TREE_NOT_EMPTY,
          'Cannot delete a group if it has sub groups',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
