import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class BasicQuery {
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

  @IsString()
  @MinLength(3)
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Comma separated sort options. Prepend - sign for descending order',
    example: '-rating,createdAt',
  })
  sort?: string;

  order?: any;
}
