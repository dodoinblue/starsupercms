import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { Account } from './entity/account.entity';
import { AuthService } from './auth.service';
import { AccountVerifyToken } from './entity/account-verify-token.entity';
import { RolesController } from './role.controller';
import { Role } from './entity/role.entity';
import { RoleService } from './role.service';
import { RoleToAccount } from './entity/role-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, AccountVerifyToken, Role, RoleToAccount])],
  controllers: [AuthController, RolesController],
  providers: [AuthService, RoleService],
})
export class AuthModule {}
