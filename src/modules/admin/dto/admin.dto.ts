import { IsOptional, IsString } from 'class-validator';
import { BasicQuery } from '../../../common/dto/query-options.dto';

export class AccountQuery extends BasicQuery {
  @IsString()
  @IsOptional()
  groupId?: string;
}
