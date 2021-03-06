import { ApiHideProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString } from 'class-validator';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Like } from '../../like/entities/like.entity';
import { Profile } from '../../profile/entity/profile.entity';
import { GroupToAccount } from './group-account.entity';
import { RoleToAccount } from './role-account.entity';

@Entity()
export class Account extends BaseEntity {
  @IsString()
  @Column({ nullable: false })
  type: string; // email, facebook, gmail, phone

  @IsString()
  @Column({ nullable: false })
  username: string;

  @IsString()
  @Column({ select: false })
  @ApiHideProperty()
  password?: string;

  @OneToMany(() => RoleToAccount, (roleToAccount) => roleToAccount.account)
  roleToAccounts!: RoleToAccount[];

  @IsBoolean()
  @Column({ nullable: false, default: false })
  verified: boolean;

  @IsInt()
  @Column({ type: 'int', default: 0 })
  status: number; // 0: normal, 10: require_reset, 100: disabled

  @OneToMany(() => Like, (like) => like.account)
  itemLikes: Like[];

  @OneToOne(() => Profile, (profile) => profile.account)
  profile: Profile;

  @OneToMany(() => GroupToAccount, (groupToAccount) => groupToAccount.account)
  groupToAccounts: GroupToAccount[];
}
