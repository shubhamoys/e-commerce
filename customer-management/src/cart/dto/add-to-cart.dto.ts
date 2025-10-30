import {
  IsUUID,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  productName: string;

  @IsNumber()
  @IsPositive()
  productPrice: number;

  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}
