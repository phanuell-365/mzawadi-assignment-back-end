import { PartialType } from '@nestjs/mapped-types';
import { CreatePointDto } from './create-point.dto';
import { IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class UpdatePointDto extends PartialType(CreatePointDto) {
  @IsOptional()
  @IsUUID()
  SaleId?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  points?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  valueOfPoints?: number;
}
