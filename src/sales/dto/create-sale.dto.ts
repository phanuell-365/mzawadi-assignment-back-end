import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
} from 'class-validator';

export class CreateSaleDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantitySold: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalAmount?: number;

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
