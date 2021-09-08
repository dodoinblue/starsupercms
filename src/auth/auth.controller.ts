import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { EmailAuth } from './dto/account.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('email/register')
  async register(@Body() { email, password }: EmailAuth) {
    return this.authService.registerByEmail(email, password);
  }

  @Post('email/login')
  async login(@Body() { email, password }: EmailAuth) {
    return this.authService.validateEmailLogin(email, password);
  }

  @Get('email/verify/:token')
  public async verifyEmail() {
    // todo
  }

  @Get('email/send-verification/:email')
  public async sendEmailVerification() {
    // todo
  }

  @Get('email/forgot-password/:email')
  public async sendEmailForgotPassword() {
    // todo
  }

  @Post('email/reset-password')
  public async setNewPassword() {
    // todo
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
