import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { omit } from 'lodash';
import { DeepPartial, Repository } from 'typeorm';
import { Account } from '../auth/entity/account.entity';
import { CustomError, ErrCodes } from '../errors/errors';
import { Profile } from './entity/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,

    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
  ) {}

  async findOne(userId: string) {
    const profile = await this.profileRepo.findOne({ account: { id: userId } });
    if (!profile) {
      throw new CustomError(ErrCodes.NOT_FOUND, 'Profile not found', HttpStatus.NOT_FOUND);
    }
    return profile;
  }

  async createProfileByUserId(userId: string, dto: DeepPartial<Profile>) {
    const account = this.accountRepo.create({ id: userId });
    const profile = this.profileRepo.create({ ...dto, account: account });
    return await this.profileRepo.insert(profile);
  }

  async updateProfileByUserId(userId: string, dto: DeepPartial<Profile>) {
    const profile = this.profileRepo.create(dto);
    return await this.profileRepo.update({ accountId: userId }, profile);
  }

  async delete(userId: string) {
    return await this.profileRepo.delete({ account: { id: userId } });
  }
}
