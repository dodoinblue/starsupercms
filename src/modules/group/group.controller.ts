import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GroupService } from './group.service';
import {
  AssignGroupMembers,
  CreateGroupDto,
  DeleteGroupMembers,
  GroupQueryOptions,
  UpdateGroupDto,
} from './dto/group.dto';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from '../../decorators/permission.decorator';
import { AccountPerms, GroupPerms } from '../../constants/permissions';
import { JwtUserId } from '../../decorators/jwt-user-id.decorator';
import { attachUserIdToDto } from '../../utils/attach-uid';

@Controller('group')
@ApiTags('Group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @Permission([GroupPerms.CREATE])
  create(@Body() createGroupDto: CreateGroupDto, @JwtUserId() userId: string) {
    attachUserIdToDto(userId, createGroupDto);
    return this.groupService.create(createGroupDto);
  }

  @Get()
  @Permission([GroupPerms.LIST])
  findAll(@Query() options: GroupQueryOptions) {
    return this.groupService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Get(':id/children')
  @Permission([GroupPerms.LIST])
  async findChildren(@Param('id') id: string) {
    return await this.groupService.findChildren(id);
  }

  @Patch(':id')
  @Permission([GroupPerms.EDIT])
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @JwtUserId() userId: string,
  ) {
    attachUserIdToDto(userId, updateGroupDto, ['updatedBy']);
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @Permission([GroupPerms.DELETE])
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }

  @Post(':groupId/members')
  @Permission([GroupPerms.EDIT, AccountPerms.EDIT])
  assignMembers(
    @Param('groupId') groupId: string,
    @Body() { memberIds: memberIds }: AssignGroupMembers,
    @JwtUserId() userId: string,
  ) {
    return this.groupService.assignMembers(groupId, memberIds, userId);
  }

  @Delete(':groupId/members/:memberIds')
  @Permission([GroupPerms.EDIT, AccountPerms.EDIT])
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMembers(
    @Param('groupId') groupId: string,
    @Query() { memberIds }: DeleteGroupMembers,
  ) {
    const members = memberIds.split(',');
    return await this.groupService.deleteMembers(groupId, members);
  }
}
