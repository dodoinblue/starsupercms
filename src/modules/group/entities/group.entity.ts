import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, MinLength, IsOptional, IsInt, IsAlphanumeric } from 'class-validator';
import { Column, Entity, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { nanoid } from '../../../utils/nanoid';
import { GroupToAccount } from '../../auth/entity/group-account.entity';

@Entity()
@Tree('materialized-path')
export class Group extends BaseEntity {
  @IsString()
  @MinLength(3)
  @ApiProperty({ description: 'Group name' })
  @Column()
  name: string;

  @IsString()
  @MinLength(3)
  @Column()
  description: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  @Column({ nullable: true })
  type?: string;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Column({ default: 0 })
  status: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Column({ default: 999 })
  seq: number;

  @TreeChildren()
  children: Group[];

  @TreeParent()
  parent: Group;

  @IsAlphanumeric()
  @IsOptional()
  @ApiProperty({ description: "Parent group's id" })
  @Column({ nullable: true })
  parentId?: string;

  @OneToMany(() => GroupToAccount, (groupToAccount) => groupToAccount.group)
  groupToAccounts: GroupToAccount[];

  mpath?: string;

  generateId() {
    console.log('child before insert');
    this.id = nanoid(6);
  }
}
