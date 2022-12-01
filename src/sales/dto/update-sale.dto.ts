import { PartialType } from '@nestjs/mapped-types';
import { CreateSaleDto } from './create-sale.dto';
import { IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class UpdateSaleDto extends PartialType(CreateSaleDto) {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantitySold?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalAmount?: number;

  @IsOptional()
  @IsUUID()
  ConsumerId?: string;

  @IsOptional()
  @IsUUID()
  ProductId?: string;

  @IsOptional()
  @IsUUID()
  DistributorId?: string;
}
