import { IsAlphanumeric, IsOptional, IsString, MinLength } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';
import { nanoid } from '../../../utils/nanoid';
import { ItemToTag } from './item-to-tag.entity';

@Entity()
export class Tag extends BaseEntity {
  @IsString()
  @MinLength(1)
  @Column()
  value: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  @Column({ nullable: true })
  description: string;

  @IsAlphanumeric()
  @MinLength(3)
  @IsOptional()
  @Column({ nullable: true })
  type: string;

  @OneToMany(() => ItemToTag, (i2t) => i2t.tag)
  itemToTags: ItemToTag[];

  generateId() {
    this.id = nanoid(6);
  }
}
