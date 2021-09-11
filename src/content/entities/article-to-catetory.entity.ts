import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { Article } from './article.entity';
import { ContentCategory } from './category.entity';

@Entity()
export class CategoryToArticle extends BaseEntity {
  @Column()
  articleId: string;

  @ManyToOne(() => Article, (article) => article.categoryToArticles)
  article: Article;

  @Column()
  categoryId: string;

  @ManyToOne(() => ContentCategory, (category) => category.categoryToArticles)
  category: ContentCategory;
}
