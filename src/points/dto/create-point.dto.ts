import { IsNotEmpty, IsNumber, IsPositive, IsUUID } from 'class-validator';

export class CreatePointDto {
  @IsNotEmpty()
  @IsUUID()
  SaleId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  points: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  valueOfPoints: number;
}
