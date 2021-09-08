import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { Account } from './entity/account.entity';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  controllers: [AuthController],
  providers: [AuthService],
  // providers: [AuthService, JWTService],
})
export class AuthModule {}
