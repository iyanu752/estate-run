import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @IsNotEmpty()
  product: string;

  @IsNumber()
  quantity: number;

  @IsString()
  @IsOptional()
  supermarket?: string;
}

export class CreateOrderDto {
  userId: string;
  items: {
    product: string;
    quantity: number;
    supermarket?: string;
  }[];
  totalAmount: number;
  deliveryAddress: string;
  deliveryInstructions?: string;
  paymentReference?: string;
  paymentStatus?: string;
  orderId?: string;
  supermarketId?: string;
  status?: string;
}

export class VerifyPaymentDto {
  reference: string;
  userId: string;
  cartItems: {
    productId: string;
    quantity: number;
    supermarket?: string;
  }[];
  deliveryAddress: string;
  deliveryInstructions?: string;
  orderId: string;
  supermarketId?: string;
}
