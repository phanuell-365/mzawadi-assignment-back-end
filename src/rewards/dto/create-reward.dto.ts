import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateRewardDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  rebateRate: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  rebateAmount: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  numOfSalesOnRebate: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  numOfSalesBeforeNextRebate: number;

  @IsNotEmpty()
  @IsUUID()
  DistributionId: string;
}
