import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { BasicTreeQuery } from '../../common/dto/query-options.dto';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from '../../decorators/permission.decorator';
import { GroupPerms } from '../../constants/permissions';
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
  findAll(@Query() options: BasicTreeQuery) {
    return this.groupService.findAll(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(id);
  }

  @Get(':id/children')
  // @Permission([GroupPerms.LIST])
  async findChildren(@Param('id') id: string) {
    const resp = await this.groupService.findChildren(id);
    console.log('resp');
    return resp;
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
}
