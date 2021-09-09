import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from '../common/dto/query-options.dto';
import { JwtGuard } from '../guards/jwt.guard';
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
  async create(@Body() dto: CreateRoleDto) {
    return await this.roleService.create(dto);
  }

  @Get(':roleId')
  @HttpCode(HttpStatus.OK)
  async getRole(@Param('roleId') roleId: string) {
    return await this.roleService.findOne(roleId);
  }

  @Post(':roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('roleId') roleId: string, @Body() dto: UpdateRoleDto) {
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
  ) {
    return this.roleService.assignMembers(roleId, memberIds);
  }

  @Delete(':roleId/members/:memberIds')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMembers(@Param('roleId') roleId: string, @Query() { memberIds }: DeleteRoleMembers) {
    const members = memberIds.split(',');
    return await this.roleService.deleteMembers(roleId, members);
  }
}
