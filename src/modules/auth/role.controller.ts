import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from '../../common/dto/query-options.dto';
import { JwtGuard } from '../../guards/jwt.guard';
import { attachUserIdToDto } from '../../utils/attach-uid';
import { AssignRoleMembers, CreateRoleDto, DeleteRoleMembers, UpdateRoleDto } from './dto/role.dto';
import { RoleService } from './role.service';

@Controller('roles')
@ApiTags('Role')
@ApiBearerAuth()
@UseGuards(JwtGuard)
export class RolesController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(@Query() options: Pagination) {
    return await this.roleService.findAll(options);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateRoleDto, @Req() request) {
    attachUserIdToDto(request, dto);
    return await this.roleService.create(dto);
  }

  @Get(':roleId')
  @HttpCode(HttpStatus.OK)
  async getRole(@Param('roleId') roleId: string) {
    return await this.roleService.findOne(roleId);
  }

  @Patch(':roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('roleId') roleId: string, @Body() dto: UpdateRoleDto, @Req() request) {
    attachUserIdToDto(request, dto, ['updatedBy']);
    return await this.roleService.updateById(roleId, dto);
  }

  @Delete(':roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('roleId') roleId: string) {
    return await this.roleService.deleteById(roleId);
  }

  @Get(':roleId/members')
  async getMembers(@Param('roleId') roleId: string, @Query() options: Pagination) {
    return await this.roleService.findMembers(roleId, options);
  }

  @Post(':roleId/members')
  assignMembers(
    @Param('roleId') roleId: string,
    @Body() { memberIds: memberIds }: AssignRoleMembers,
    @Req() request,
  ) {
    const operator = request.custom.userId;
    return this.roleService.assignMembers(roleId, memberIds, operator);
  }

  @Delete(':roleId/members/:memberIds')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMembers(@Param('roleId') roleId: string, @Query() { memberIds }: DeleteRoleMembers) {
    const members = memberIds.split(',');
    return await this.roleService.deleteMembers(roleId, members);
  }
}
