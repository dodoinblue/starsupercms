import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

@Entity()
export class Announce extends BaseEntity {
  @IsString()
  @Column()
  title: string;

  @IsString()
  @Column()
  content: string;

  @IsString()
  @Column({ nullable: true })
  link: string;

  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  type?: string; // neutral, negative, positive, promotional

  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  icon?: string;

  @IsInt()
  @IsOptional()
  @Column({ default: 0 })
  status?: number; // 0: active, 400 inactive

  @IsDate()
  @IsOptional()
  @Column({ nullable: true })
  expireAt?: Date;
}
