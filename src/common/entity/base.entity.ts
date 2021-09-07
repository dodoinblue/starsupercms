import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { nanoid } from '../../utils/nanoid';

export abstract class BaseEntity {
  @PrimaryColumn({ length: 32, nullable: false })
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  createdBy: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  updatedBy: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  generateId() {
    this.id = nanoid(16);
  }
}
