import { PartialType } from '@nestjs/mapped-types';
import { CreateRewardDto } from './create-reward.dto';
import { IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class UpdateRewardDto extends PartialType(CreateRewardDto) {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  rebateRate?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  rebateAmount?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numOfSalesOnRebate?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numOfSalesBeforeNextRebate?: number;

  @IsOptional()
  @IsUUID()
  DistributionId?: string;
}
