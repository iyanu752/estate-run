import { IsArray, IsMongoId, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsMongoId()
  userId: string;

  @IsArray()
  items: {
    products: string;
    quantity: number;
  }[];

  @IsNumber()
  totlAmount: number;

  @IsString()
  deliveryAddress: string;
}
