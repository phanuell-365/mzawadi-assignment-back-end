import { PartialType } from '@nestjs/mapped-types';
import { CreateDistributorDto } from './create-distributor.dto';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateDistributorDto extends PartialType(CreateDistributorDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  rewardAmount?: number;
}
