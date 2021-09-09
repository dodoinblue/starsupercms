import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Self } from '../decorators/self.decorator';
import { User } from '../decorators/user.decorator';
import { JwtGuard } from '../guards/jwt.guard';
import { ProfileDto } from './dto/profile.dto';
import { ProfilesService } from './profiles.service';
import lodash from 'lodash';
import { CustomError, ErrCodes } from '../errors/errors';

@Controller('profile')
@ApiBearerAuth()
@ApiTags('Profile')
@UseGuards(JwtGuard)
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @Get()
  async queryProfile() {
    // todo
  }

  @Get('users/:userId')
  @Self()
  async getProfile(@Param('userId') userId: string) {
    return await this.profileService.findOne(userId);
  }

  // Create or update
  @Post('users/:userId')
  @Self()
  async createProfile(
    @Param('userId') userId: string,
    @User() operator: string,
    @Body() dto: ProfileDto,
  ) {
    if (lodash.isEmpty(dto)) {
      throw new CustomError(
        ErrCodes.VALIDATION_ERROR,
        'Body should not be empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.profileService.createOrUpdate(userId, operator, dto);
  }

  @Delete('users/:userId')
  @Self()
  async deleteProfile(@Param('userId') userId: string) {
    return await this.profileService.delete(userId);
  }
}
