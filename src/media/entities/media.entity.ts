import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';

@Entity()
export class Media extends BaseEntity {
  @Column({ nullable: true })
  description: string;

  @Column()
  uri: string;

  @Column()
  type: string;
}
