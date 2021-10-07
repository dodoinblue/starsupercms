import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountPerms, GroupPerms, RolePerms } from '../../constants/permissions';
import { JwtUserId } from '../../decorators/jwt-user-id.decorator';
import { Permission } from '../../decorators/permission.decorator';
import { Self } from '../../decorators/self.decorator';
import { AccountService } from './account.service';
import { AssignGroups, AssignRoles } from './dto/account.dto';

@Controller('accounts')
@ApiTags('Account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get(':userId')
  @Self()
  getAccounts(@Param('userId') userId: string) {
    return this.accountService.findOneAccount(userId);
  }

  @Post(':userId/roles')
  @Permission([RolePerms.EDIT, AccountPerms.EDIT])
  assignRoles(
    @Param('userId') userId: string,
    @Body() { roleIds }: AssignRoles,
    @JwtUserId() operator: string,
  ) {
    return this.accountService.assignRoles(userId, roleIds, operator);
  }

  @Post(':userId/groups')
  @Permission([GroupPerms.EDIT, AccountPerms.EDIT])
  assignGroups(
    @Param('userId') userId: string,
    @Body() { groupIds }: AssignGroups,
    @JwtUserId() operator: string,
  ) {
    return this.accountService.assignGroups(userId, groupIds, operator);
  }
}
