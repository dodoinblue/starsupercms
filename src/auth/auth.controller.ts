import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Login } from './dto/account.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  @Post('email/register')
  async register() {
    // todo
  }

  @Post('email/login')
  async login(@Body() body: Login) {
    // todo
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
