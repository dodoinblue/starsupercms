import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { Account } from './entity/account.entity';
import { AuthService } from './auth.service';
import { AccountVerifyToken } from './entity/account-verify-token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, AccountVerifyToken])],
  controllers: [AuthController],
  providers: [AuthService],
  // providers: [AuthService, JWTService],
})
export class AuthModule {}
