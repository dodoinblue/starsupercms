import {
  IsDateString,
  IsEmail,
  IsJSON,
  IsMobilePhone,
  IsOptional,
  IsPostalCode,
  IsString,
} from 'class-validator';

export class ProfileDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsMobilePhone()
  @IsOptional()
  phone?: string;

  @IsDateString({ strict: true })
  @IsOptional()
  birthdayDate?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsPostalCode()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  lang?: string;

  @IsJSON()
  @IsOptional()
  extra?: any;
}
