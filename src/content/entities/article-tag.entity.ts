import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { Article } from '../../modules/item/entities/item.entity';
import { Tag } from './tag.entity';

@Entity()
export class ArticleToTag extends BaseEntity {
  @IsString()
  @Column()
  articleId: string;

  @ManyToOne(() => Article, (article) => article.articleToTags)
  article: Article;

  @IsString()
  @Column()
  tagId: string;

  @ManyToOne(() => Tag, (tag) => tag.articleToTags)
  tag: Tag;
}
