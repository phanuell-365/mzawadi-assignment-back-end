import { PartialType } from '@nestjs/mapped-types';
import { CreateConsumerDto } from './create-consumer.dto';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateConsumerDto extends PartialType(CreateConsumerDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
