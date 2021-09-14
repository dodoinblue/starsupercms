import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Self } from '../../decorators/self.decorator';
import { ProfileDto } from './dto/profile.dto';
import { ProfilesService } from './profiles.service';
import lodash from 'lodash';
import { CustomError, ErrCodes } from '../../errors/errors';
import { attachUserIdToDto } from '../../utils/attach-uid';
import { JwtUserId } from '../../decorators/jwt-user-id.decorator';

@Controller('profile')
@ApiTags('Profile')
export class ProfilesController {
  constructor(private readonly profileService: ProfilesService) {}

  @Get('users/:userId')
  @Self()
  async getProfile(@Param('userId') userId: string) {
    return await this.profileService.findOne(userId);
  }

  // Create
  @Put('users/:userId')
  @Self()
  async createProfile(
    @Param('userId') userId: string,
    @Body() dto: ProfileDto,
    @JwtUserId() jwtUserId,
  ) {
    if (lodash.isEmpty(dto)) {
      throw new CustomError(
        ErrCodes.VALIDATION_ERROR,
        'Body should not be empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Just in case we allow admins to change user's profile.
    // Then editor & creator may not be the same user.
    attachUserIdToDto(jwtUserId, dto);
    return await this.profileService.createProfileByUserId(userId, dto);
  }

  // Update
  @Patch('users/:userId')
  @Self()
  async updateProfile(
    @Param('userId') userId: string,
    @Body() dto: ProfileDto,
    @JwtUserId() jwtUserId: string,
  ) {
    if (lodash.isEmpty(dto)) {
      throw new CustomError(
        ErrCodes.VALIDATION_ERROR,
        'Body should not be empty',
        HttpStatus.BAD_REQUEST,
      );
    }
    attachUserIdToDto(jwtUserId, dto, ['updatedBy']);
    return await this.profileService.updateProfileByUserId(userId, dto);
  }

  @Delete('users/:userId')
  @Self()
  async deleteProfile(@Param('userId') userId: string) {
    return await this.profileService.delete(userId);
  }
}
