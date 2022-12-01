import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantitySold?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalAmount?: number;
}
