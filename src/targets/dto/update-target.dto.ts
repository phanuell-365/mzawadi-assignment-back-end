import { PartialType } from '@nestjs/mapped-types';
import { CreateTargetDto } from './create-target.dto';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class UpdateTargetDto extends PartialType(CreateTargetDto) {
  @IsOptional()
  @IsNumber()
  salesTarget?: number;

  @IsOptional()
  @IsUUID()
  DistributorId?: string;

  @IsOptional()
  @IsUUID()
  ProductId?: string;
}
