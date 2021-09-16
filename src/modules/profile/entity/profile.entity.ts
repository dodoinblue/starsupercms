import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Account } from '../../auth/entity/account.entity';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity()
export class Profile extends BaseEntity {
  @OneToOne(() => Account)
  @JoinColumn()
  account: Account;

  @Column()
  accountId: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  intro: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  birthdayDate?: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  province?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ nullable: true })
  timezone?: string;

  @Column({ nullable: true })
  lang?: string;

  @Column('simple-json', { nullable: true })
  extra?: any;
}
