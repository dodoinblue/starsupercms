import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { nanoid } from 'nanoid';
import { Column, Entity, Tree, TreeChildren, TreeParent } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';

@Entity()
@Tree('materialized-path')
export class ContentCategory extends BaseEntity {
  @IsString()
  @MinLength(3)
  @ApiProperty({ description: 'Category name' })
  @Column()
  name: string;

  @IsString()
  @MinLength(3)
  @Column()
  description: string;

  @Matches(/^[A-Za-z0-9_\-]+$/, {
    message: `Only 0-9 a-z A-Z - _ are allowed`,
  })
  @MinLength(3)
  @MaxLength(64)
  @ApiProperty({ description: 'Alias of the category name/id. Alphanumerical and _- are allowed.' })
  @Column({ nullable: false, unique: true })
  slug: string;

  @TreeChildren()
  children: ContentCategory[];

  @TreeParent({ onDelete: 'CASCADE' })
  parent: ContentCategory;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: "Parent category's id" })
  @Column({ nullable: true })
  parentId?: string;

  generateId() {
    console.log('child before insert');
    this.id = nanoid(6);
  }
}
