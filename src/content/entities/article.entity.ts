import {
  IsAlphanumeric,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { ArticleToTag } from './article-tag.entity';
import { ContentCategory } from './category.entity';

@Entity()
export class Article extends BaseEntity {
  @IsString()
  @MinLength(3)
  @Column()
  title: string;

  @Matches(/^[A-Za-z0-9_\-]+$/, {
    message: `Only 0-9 a-z A-Z - _ are allowed`,
  })
  @MinLength(3)
  @MaxLength(64)
  @Column({ nullable: false, unique: true })
  slug: string;

  @IsString()
  @Column({ type: 'text' })
  content: string;

  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  intro: string;

  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  cover: string;

  @IsAlphanumeric()
  @MinLength(3)
  @MaxLength(12)
  @IsOptional()
  @Column({ nullable: true })
  password: string;

  @IsString({ each: true })
  @IsOptional()
  @Column('simple-array', { nullable: true })
  keywords: string[];

  @IsInt()
  @IsOptional()
  @Column({ default: 0 })
  state: number; // 0: draft, 100: under review, 200: published

  @ManyToOne(() => ContentCategory, (category) => category.articles)
  category: ContentCategory;

  @Column({ nullable: true })
  @IsOptional()
  categoryId?: string;

  @OneToMany(() => ArticleToTag, (a2t) => a2t.article)
  articleToTags: ArticleToTag[];
}
