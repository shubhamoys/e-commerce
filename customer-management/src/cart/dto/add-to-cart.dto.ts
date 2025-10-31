import { IsUUID, IsNotEmpty, IsInt, IsPositive, Min } from 'class-validator';

export class AddToCartDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;
}
