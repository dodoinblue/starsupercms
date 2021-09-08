import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { APP_INFO, AUTH } from '../config/configurations';
import { EmailService } from '../helper/email.service';
import { AccountTokenPurpose, AccountType } from './auth.interface';
import { AuthService } from './auth.service';
import { Email, EmailAuth, EmailResetPassword, EmailVerify } from './dto/account.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Post('email/register')
  async register(@Body() { email, password }: EmailAuth) {
    const regResponse = await this.authService.registerByEmail(email, password);

    if (AUTH.requireVerify) {
      try {
        const token = await this.authService.createAccountVerifyToken(
          AccountType.Email,
          email,
          AccountTokenPurpose.Verify,
          {
            skipAccountCheck: true,
          },
        );
        const content = `Your verification code is: ${token}`;
        this.emailService.sendMail({
          subject: `[${APP_INFO.name}] Thank you for signing up`,
          to: email,
          text: content,
          html: content,
        });
      } catch (sendEmailError) {
        console.warn(`Failed to send verification email to ${email}`);
      }
    }

    return regResponse;
  }

  @Post('email/login')
  @HttpCode(200)
  async login(@Body() { email, password }: EmailAuth) {
    return this.authService.validateEmailLogin(email, password);
  }

  @Post('email/verify')
  @HttpCode(204)
  public async verifyEmail(@Body() { email, token }: EmailVerify) {
    return this.authService.verifyEmail(email, token);
  }

  @Post('email/send-verification')
  @HttpCode(204)
  public async sendEmailVerification(@Body() { email }: Email) {
    const token = await this.authService.createAccountVerifyToken(
      AccountType.Email,
      email,
      AccountTokenPurpose.Verify,
    );
    const content = `Your verification code is: ${token}`;
    this.emailService.sendMail({
      subject: `[${APP_INFO.name}] Thank you for signing up`,
      to: email,
      text: content,
      html: content,
    });
  }

  @Post('email/forgot-password')
  @HttpCode(204)
  public async sendEmailForgotPassword(@Body() { email }: Email) {
    const token = await this.authService.createAccountVerifyToken(
      AccountType.Email,
      email,
      AccountTokenPurpose.Reset,
    );
    const content = `Your password reset code is: ${token}`;
    this.emailService.sendMail({
      subject: `[${APP_INFO.name}] Reset password`,
      to: email,
      text: content,
      html: content,
    });
  }

  @Post('email/reset-password')
  @HttpCode(204)
  public async setNewPassword(@Body() { email, token, password }: EmailResetPassword) {
    return await this.authService.resetPasswordByEmailToken(email, token, password);
  }

  @Post('token/validate')
  checkToken() {
    // todo
  }

  @Post('token/renewal')
  renewalToken() {
    // todo
  }
}
