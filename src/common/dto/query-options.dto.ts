import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class Pagination {
  @IsInt()
  @Type(() => Number)
  @Min(0)
  @IsOptional()
  skip?: number = 0;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(1000)
  @IsOptional()
  take?: number = 20;
}
