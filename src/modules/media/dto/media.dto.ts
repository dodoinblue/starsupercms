import { IsOptional, IsString } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  @IsOptional()
  description: string;
}
