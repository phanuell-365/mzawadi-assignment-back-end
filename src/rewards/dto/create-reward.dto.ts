import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreateRewardDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  rebateAmount: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  salesTarget: number;

  @IsNotEmpty()
  @IsUUID()
  DistributorId: string;

  @IsNotEmpty()
  @IsUUID()
  ProductId: string;
}
