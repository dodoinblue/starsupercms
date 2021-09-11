import { IsInt, IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { CategoryToArticle } from './article-to-catetory.entity';

@Entity()
export class Article extends BaseEntity {
  @IsString()
  @Column()
  title: string;

  @IsString()
  @Column({ type: 'text' })
  content: string;

  @IsString()
  @Column()
  intro: string;

  @IsString()
  @Column()
  cover: string;

  @IsString()
  @Column({ nullable: true })
  password: string;

  @IsString({ each: true })
  @Column('simple-array')
  keywords: string[];

  @IsInt()
  @Column({ default: 0 })
  state: number; // 0: draft, 100: under review, 200: published

  @OneToMany(() => CategoryToArticle, (c2a) => c2a.article)
  categoryToArticles!: CategoryToArticle[];
}
