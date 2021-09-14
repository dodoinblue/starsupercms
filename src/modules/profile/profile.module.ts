import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../auth/entity/account.entity';
import { Profile } from './entity/profile.entity';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Account])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
