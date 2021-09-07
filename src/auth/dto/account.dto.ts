import { IsString } from 'class-validator';

export class Login {
  @IsString()
  type: string;

  @IsString()
  username: string;

  @IsString()
  password: string;
}
