import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BasicQuery } from '../../common/dto/query-options.dto';
import { AccountPerms, SiteSettingPerms } from '../../constants/permissions';
import { Permission } from '../../decorators/permission.decorator';
import { SortToOrderPipe } from '../../pipes/sort-option.pipe';
import * as Perms from '../../constants/permissions';
import { AccountService } from '../auth/account.service';
import { AccountQuery } from './dto/admin.dto';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly accountService: AccountService) {}

  @Get('accounts')
  @Permission([AccountPerms.LIST])
  getAccounts(@Query(SortToOrderPipe) options: AccountQuery) {
    return this.accountService.findAccounts(options);
  }

  @Get('permissions')
  @Permission([SiteSettingPerms.READ])
  getPermissions() {
    const permissionList = Object.keys(Perms).map((categoryKey) => ({
      key: categoryKey,
      children: Object.keys(Perms[categoryKey]).map((permKey) => ({
        key: Perms[categoryKey][permKey],
      })),
    }));
    return permissionList;
  }
}
