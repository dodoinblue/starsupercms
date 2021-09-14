import { IsString } from 'class-validator';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { Account } from '../../auth/entity/account.entity';
import { BaseEntity } from '../../../common/entity/base.entity';
import { Item } from '../../item/entities/item.entity';

@Entity()
@Unique(['itemId', 'accountId'])
export class Like extends BaseEntity {
  @IsString()
  @Column()
  itemId: string;

  @ManyToOne(() => Item, (item) => item.likes)
  item: Item;

  @IsString()
  @Column()
  accountId: string;

  @ManyToOne(() => Account, (account) => account.itemLikes)
  account: Account;
}
