import { IsIn, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { RoleToAccount } from './role-account.entity';
import * as perms from '../../../constants/permissions';
import { Type } from 'class-transformer';

const permString = [];
Object.keys(perms).forEach((category) => {
  const perm = perms[category];
  Object.keys(perm).forEach((permKey) => permString.push(perm[permKey]));
});

@Entity()
export class Role extends BaseEntity {
  @IsString()
  @MinLength(3)
  @Column({ nullable: false, unique: true })
  key: string;

  @IsString()
  @MinLength(3)
  @Column({ nullable: false })
  name: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => RoleToAccount, (roleToAccount) => roleToAccount.role)
  roleToAccounts!: RoleToAccount[];

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Column({ type: 'int', default: 0 })
  status?: number; // 0: normal

  @IsIn(permString, { each: true })
  @IsOptional()
  @Column({ type: 'json', nullable: true })
  permissions?: string[];
}
