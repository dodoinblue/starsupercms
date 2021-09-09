import { IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { RoleToAccount } from './role-account.entity';

@Entity()
export class Role extends BaseEntity {
  @IsString()
  @Column({ nullable: false, unique: true })
  key: string;

  @IsString()
  @Column({ nullable: false })
  name: string;

  @IsString()
  @Column({ nullable: true })
  description: string;

  @OneToMany(() => RoleToAccount, (roleToAccount) => roleToAccount.role)
  roleToAccounts!: RoleToAccount[];

  @Column({ type: 'int', default: 0 })
  status: number; // 0: normal
}
