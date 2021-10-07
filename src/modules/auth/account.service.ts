import lodash from 'lodash';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Account } from './entity/account.entity';
import { RoleToAccount } from './entity/role-account.entity';
import { GroupToAccount } from './entity/group-account.entity';
import { Role } from './entity/role.entity';
import { AccountQuery } from '../admin/dto/admin.dto';

@Injectable()
export class AccountService {
  constructor(
    private connection: Connection,

    @InjectRepository(Account)
    private accountRepo: Repository<Account>,

    @InjectRepository(RoleToAccount)
    private r2aRepo: Repository<RoleToAccount>,

    @InjectRepository(Role)
    private roleRepo: Repository<Role>,

    @InjectRepository(GroupToAccount)
    private g2aRepo: Repository<GroupToAccount>,
  ) {}

  async findAccounts(options: AccountQuery) {
    let qb = this.accountRepo
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.profile', 'profile')
      .leftJoinAndSelect('account.roleToAccounts', 'roleToAccounts')
      .leftJoinAndSelect('roleToAccounts.role', 'role')
      .leftJoinAndSelect('account.groupToAccounts', 'groupToAccounts')
      .leftJoinAndSelect('groupToAccounts.group', 'group');
    if (options.groupId) {
      qb = qb.where('group.mpath LIKE BINARY :groupId', { groupId: `%${options.groupId}%` });
    }
    qb = qb.skip(options.skip).take(options.take);
    if (options.order) {
      const sortKeys = Object.keys(options.order);
      for (let i = 0; i < sortKeys.length; i++) {
        const sortKey = sortKeys[i];
        if (i === 0) {
          qb = qb.orderBy(sortKey, options.order[sortKey]);
        } else {
          qb = qb.addOrderBy(sortKey, options.order[sortKey]);
        }
      }
    }
    const [items, total] = await qb.getManyAndCount();

    const formatted = items.map((item) => {
      const picked = lodash.pick(item, [
        'id',
        'username',
        'type',
        'verified',
        'status',
        'createdAt',
        'createdBy',
        'profile',
      ]);
      const r2as = item.roleToAccounts;
      const g2as = item.groupToAccounts;
      if (r2as.length > 0) {
        (picked as any).roles = r2as.map((r2a) => lodash.pick(r2a.role, ['id', 'key', 'name']));
      }
      if (g2as.length > 0) {
        (picked as any).groups = g2as.map((g2a) => lodash.pick(g2a.group, ['id', 'name', 'mpath']));
      }
      return picked;
    });
    return { items: formatted, total };
  }

  async findOneAccount(userId) {
    const account = await this.accountRepo.findOne({
      where: {
        id: userId,
      },
      relations: [
        'profile',
        'roleToAccounts',
        'roleToAccounts.role',
        'groupToAccounts',
        'groupToAccounts.group',
      ],
    });

    const picked = lodash.pick(account, [
      'id',
      'username',
      'type',
      'verified',
      'status',
      'createdAt',
      'createdBy',
      'profile',
    ]);
    const r2as = account.roleToAccounts;
    const g2as = account.groupToAccounts;
    if (r2as.length > 0) {
      (picked as any).roles = r2as.map((r2a) => lodash.pick(r2a.role, ['id', 'key', 'name']));
    }
    if (g2as.length > 0) {
      (picked as any).groups = g2as.map((g2a) => lodash.pick(g2a.group, ['id', 'name', 'mpath']));
    }
    return picked;
  }

  async assignRoles(userId: string, roleIds: string[], operator: string) {
    const r2as = roleIds.map((id) =>
      this.r2aRepo.create({
        accountId: userId,
        roleId: id,
        createdBy: operator,
        updatedBy: operator,
      }),
    );

    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    try {
      await runner.manager.delete(RoleToAccount, { accountId: userId });
      await runner.manager.save(r2as);
      await runner.commitTransaction();
    } catch (error) {
      await runner.rollbackTransaction();
      throw error;
    } finally {
      await runner.release();
    }
  }

  async assignGroups(userId: string, groupIds: string[], operator: string) {
    const g2as = groupIds.map((id) =>
      this.g2aRepo.create({
        accountId: userId,
        groupId: id,
        createdBy: operator,
        updatedBy: operator,
      }),
    );

    const runner = this.connection.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();

    try {
      await runner.manager.delete(GroupToAccount, { accountId: userId });
      await runner.manager.save(g2as);
      await runner.commitTransaction();
    } catch (error) {
      await runner.rollbackTransaction();
      throw error;
    } finally {
      await runner.release();
    }
  }
}
