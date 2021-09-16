import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BasicQuery } from '../../common/dto/query-options.dto';
import { AccountPerms } from '../../constants/permissions';
import { Permission } from '../../decorators/permission.decorator';
import { SortToOrderPipe } from '../../pipes/sort-option.pipe';
import { AuthService } from '../auth/auth.service';

@Controller('admin')
@ApiTags('Admin')
export class AdminController {
  constructor(private readonly authService: AuthService) {}

  @Get('accounts')
  @Permission([AccountPerms.LIST])
  getAccounts(@Query(SortToOrderPipe) options: BasicQuery) {
    return this.authService.findAccounts(options);
  }
}
