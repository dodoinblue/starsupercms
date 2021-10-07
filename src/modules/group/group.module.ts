import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { Group } from './entities/group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupToAccount } from '../auth/entity/group-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupToAccount])],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
