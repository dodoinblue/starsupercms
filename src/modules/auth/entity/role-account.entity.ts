import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Account } from './account.entity';
import { Role } from './role.entity';

@Entity()
export class RoleToAccount extends BaseEntity {
  @Column()
  roleId: string;

  @ManyToOne(() => Role, (role) => role.roleToAccounts)
  role: Role;

  @Column()
  accountId: string;

  @ManyToOne(() => Account, (account) => account.roleToAccounts)
  account: Account;
}
