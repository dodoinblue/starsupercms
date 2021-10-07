import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Group } from '../../group/entities/group.entity';
import { Account } from './account.entity';
import { Role } from './role.entity';

@Entity()
export class GroupToAccount extends BaseEntity {
  @Column()
  groupId: string;

  @ManyToOne(() => Group, (group) => group.groupToAccounts)
  group: Role;

  @Column()
  accountId: string;

  @ManyToOne(() => Account, (account) => account.roleToAccounts)
  account: Account;
}
