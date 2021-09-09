import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Pagination } from '../common/dto/query-options.dto';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
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

  async create(dto: CreateRoleDto) {
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

  async updateById(id: string, update: UpdateRoleDto) {
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

  async assignMembers(roleId: string, memberIds: string[]) {
    const roleAccounts = memberIds.map((memberId) =>
      this.r2aRepo.create({ role: { id: roleId }, account: { id: memberId } }),
    );
    return await this.r2aRepo.save(roleAccounts);
  }

  async deleteMembers(roleId: string, memberIds: string[]) {
    await this.r2aRepo.delete({ role: { id: roleId }, account: { id: In(memberIds) } });
  }
}
