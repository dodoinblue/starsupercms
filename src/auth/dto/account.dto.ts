import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class EmailAuth {
  @IsEmail()
  email: string;

  @MinLength(6)
  @MaxLength(128)
  @Matches(/^[A-Za-z0-9~`!@#\$%\^&\*\(\)_\-\+=\{\[\}\]\|\\:;"'<,>\.\?\/]+$/, {
    message: `Only 0-9 a-z A-Z and ~\`!@#$%^&*()_-+={[}]|\:;"'<,>.?/ are allowed`,
  })
  password: string;
}

export class Email {
  @IsEmail()
  email: string;
}

export class EmailVerify {
  @IsEmail()
  email: string;

  @IsString()
  token: string;
}

export class EmailResetPassword extends EmailAuth {
  @IsString()
  token: string;
}
