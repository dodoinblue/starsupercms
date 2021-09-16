import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsOptional } from 'class-validator';
import { Column, Entity, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { nanoid } from '../../../utils/nanoid';

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

  @TreeChildren()
  children: Group[];

  @TreeParent()
  parent: Group;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Parent group's id" })
  @Column({ nullable: true })
  parentId?: string;

  generateId() {
    console.log('child before insert');
    this.id = nanoid(6);
  }
}
