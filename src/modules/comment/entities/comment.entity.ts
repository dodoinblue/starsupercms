import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsJSON,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Column, Entity, ManyToOne, Tree } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Item } from '../../item/entities/item.entity';

@Entity()
@Tree('materialized-path')
export class Comment extends BaseEntity {
  @IsString()
  @MinLength(10)
  @MaxLength(3000)
  content: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Parent commentId' })
  @Column({ nullable: true })
  parentId?: string;

  @IsBoolean()
  @Column({ default: false })
  isTop: boolean;

  @IsInt()
  @Column({ default: 0 })
  status: number; // 0: normal, 404: hidden

  @IsString()
  @Column({ nullable: true })
  ip?: string;

  @IsJSON()
  @Column('simple-json')
  extra?: any;

  @ManyToOne(() => Item, (article) => article.comments)
  item: Item;

  @IsString()
  @Column()
  itemId: string;
}
