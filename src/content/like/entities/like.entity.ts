import { IsString } from 'class-validator';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';
import { Account } from '../../../auth/entity/account.entity';
import { nanoid } from '../../../utils/nanoid';
import { Item } from '../../../modules/item/entities/item.entity';

@Entity()
@Unique(['articleId', 'accountId'])
export class Like {
  @PrimaryColumn({ length: 32, nullable: false, unique: true })
  id: string;

  @IsString()
  @Column()
  articleId: string;

  @ManyToOne(() => Item, (article) => article.likes)
  article: Item;

  @IsString()
  @Column()
  accountId: string;

  @ManyToOne(() => Account, (account) => account.articleLikes)
  account: Account;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  generateId() {
    this.id = nanoid(16);
  }
}
