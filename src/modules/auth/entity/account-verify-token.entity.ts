import { IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity()
export class AccountVerifyToken extends BaseEntity {
  @IsString()
  @Column({ nullable: false })
  type: string;

  @IsString()
  @Column({ nullable: false })
  username: string;

  @IsString()
  @Column({ nullable: false })
  token: string;

  @IsString()
  @Column({ nullable: false })
  purpose: string;
}
