import { IsAlphanumeric, IsOptional, IsString, MinLength } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { nanoid } from '../../utils/nanoid';
import { ArticleToTag } from './article-tag.entity';

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

  @OneToMany(() => ArticleToTag, (a2t) => a2t.tag)
  articleToTags: ArticleToTag[];

  generateId() {
    this.id = nanoid(6);
  }
}
