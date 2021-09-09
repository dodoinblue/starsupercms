import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Pagination } from '../common/dto/query-options.dto';
import { RoleToAccount } from './entity/role-account.entity';
import { Role } from './entity/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,

    @InjectRepository(RoleToAccount)
    private r2aRepo: Repository<RoleToAccount>,
  ) {}

  async create(dto: Partial<Role>) {
    const role = this.roleRepo.create(dto);
    return await this.roleRepo.save(role);
  }

  async findAll({ skip, take }: Pagination) {
    const [items, total] = await this.roleRepo.findAndCount({ skip, take });
    return {
      items,
      total,
    };
  }

  async findOne(id: string) {
    return await this.roleRepo.findOne(id);
  }

  async updateById(id: string, update: Partial<Role>) {
    await this.roleRepo.update({ id }, update);
  }

  async deleteById(id: string) {
    await this.roleRepo.delete(id);
  }

  async findMembers(roleId: string, options: Pagination) {
    const [items, total] = await this.r2aRepo.findAndCount({
      where: { roleId },
      ...options,
      select: [`accountId`],
    });
    return { items, total };
  }

  async assignMembers(roleId: string, memberIds: string[], operator: string) {
    const roleAccounts = memberIds.map((memberId) =>
      this.r2aRepo.create({ roleId, accountId: memberId, createdBy: operator }),
    );
    return await this.r2aRepo.save(roleAccounts);
  }

  async deleteMembers(roleId: string, memberIds: string[]) {
    await this.r2aRepo.delete({ roleId, accountId: In(memberIds) });
  }
}
