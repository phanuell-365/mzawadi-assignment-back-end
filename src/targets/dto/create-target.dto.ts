import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateTargetDto {
  @IsNotEmpty()
  @IsNumber()
  salesTarget: number;

  @IsNotEmpty()
  @IsUUID()
  DistributorId: string;

  @IsNotEmpty()
  @IsUUID()
  ProductId: string;
}
