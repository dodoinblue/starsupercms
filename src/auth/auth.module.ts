import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
import { Account } from './entity/account.entity';
// import { JWTService } from './jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  controllers: [AuthController],
  // providers: [AuthService, JWTService],
})
export class AuthModule {}
