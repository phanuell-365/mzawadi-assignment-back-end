import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateConsumerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  phone: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  points?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  valueOfPoints?: number;
}
