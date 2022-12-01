import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateSaleDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  transactionAmount?: number;

  @IsNotEmpty()
  @IsUUID()
  ConsumerId: string;

  @IsNotEmpty()
  @IsUUID()
  ProductId: string;

  @IsNotEmpty()
  @IsUUID()
  DistributorId: string;
}
