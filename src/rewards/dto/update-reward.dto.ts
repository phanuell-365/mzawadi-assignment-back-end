import { PartialType } from '@nestjs/mapped-types';
import { CreateRewardDto } from './create-reward.dto';
import { IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class UpdateRewardDto extends PartialType(CreateRewardDto) {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  rebateAmount?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  salesTarget?: number;

  @IsOptional()
  @IsUUID()
  DistributorId?: string;

  @IsOptional()
  @IsUUID()
  ProductId?: string;
}
