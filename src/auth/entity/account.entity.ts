import { IsString } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { User } from './user.entity';

@Entity()
export class Account extends BaseEntity {
  @IsString()
  @Column({ nullable: false })
  type: string; // email, facebook, gmail, phone

  @IsString()
  @Column({ nullable: false })
  username: string;

  @IsString()
  @Column()
  password?: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'int', default: 0 })
  status: number; // 0: normal, 10: require_reset, 100: disabled
}
