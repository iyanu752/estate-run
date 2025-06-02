import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString({ message: 'Product name must be a string' })
  name: string;

  @IsNotEmpty({
    message: 'Product category is required',
  })
  @IsString({ message: 'Product category must be a string' })
  category: string;

  @IsNotEmpty({ message: 'Product description is required' })
  @IsString({ message: 'Product description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'Product price is required' })
  @IsNumber({}, { message: 'Product price must be a number' })
  price: number;

  @IsNotEmpty({ message: 'Product location is required' })
  @IsString({ message: 'Product location must be a string' })
  location: string;

  @IsNotEmpty({ message: 'Product stock is required' })
  @IsNumber({}, { message: 'Product stock must be a number' })
  stock: number;

  @IsNotEmpty({ message: 'Product image is required' })
  @IsString({ message: 'Product image must be a string' })
  image: string;

  @IsNotEmpty({ message: 'product method is required' })
  @IsString({ message: 'Product methiod must be a string' })
  method: string;
}
