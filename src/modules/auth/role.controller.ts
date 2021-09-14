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
import { BasicQuery } from '../../common/dto/query-options.dto';
import { JwtUserId } from '../../decorators/jwt-user-id.decorator';
import { JwtGuard } from '../../guards/jwt.guard';
import { SortToOrderPipe } from '../../pipes/sort-option.pipe';
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
  async list(@Query(SortToOrderPipe) options: BasicQuery) {
    return await this.roleService.findAll(options);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateRoleDto, @JwtUserId() userId: string) {
    attachUserIdToDto(userId, dto);
    return await this.roleService.create(dto);
  }

  @Get(':roleId')
  @HttpCode(HttpStatus.OK)
  async getRole(@Param('roleId') roleId: string) {
    return await this.roleService.findOne(roleId);
  }

  @Patch(':roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param('roleId') roleId: string,
    @Body() dto: UpdateRoleDto,
    @JwtUserId() userId: string,
  ) {
    attachUserIdToDto(userId, dto, ['updatedBy']);
    return await this.roleService.updateById(roleId, dto);
  }

  @Delete(':roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('roleId') roleId: string) {
    return await this.roleService.deleteById(roleId);
  }

  @Get(':roleId/members')
  async getMembers(@Param('roleId') roleId: string, @Query(SortToOrderPipe) options: BasicQuery) {
    return await this.roleService.findMembers(roleId, options);
  }

  @Post(':roleId/members')
  assignMembers(
    @Param('roleId') roleId: string,
    @Body() { memberIds: memberIds }: AssignRoleMembers,
    @JwtUserId() userId: string,
  ) {
    return this.roleService.assignMembers(roleId, memberIds, userId);
  }

  @Delete(':roleId/members/:memberIds')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMembers(@Param('roleId') roleId: string, @Query() { memberIds }: DeleteRoleMembers) {
    const members = memberIds.split(',');
    return await this.roleService.deleteMembers(roleId, members);
  }
}
