import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateTargetDto {
  @IsNotEmpty()
  @IsNumber()
  salesTarget: number;

  @IsOptional()
  @IsNumber()
  valueOfSalesTarget?: number;

  @IsNotEmpty()
  @IsUUID()
  DistributorId: string;

  @IsNotEmpty()
  @IsUUID()
  ProductId: string;
}
