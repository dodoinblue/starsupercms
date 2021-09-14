import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entity/base.entity';

export class CarouselItem {
  @IsString()
  mediaId: string;

  @IsString()
  @IsOptional()
  link?: string;
}

@Entity()
export class Carousel extends BaseEntity {
  @IsObject({ each: true })
  @Type(() => CarouselItem)
  @ValidateNested()
  @Column({ type: 'json' })
  @ApiProperty({ description: 'Full list must be provided when update' })
  items: CarouselItem[];
}
