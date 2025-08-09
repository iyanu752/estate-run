import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString({ message: 'Product name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Owner Id can not be empty' })
  @IsString({ message: 'Owner Id must be a string' })
  ownerId: string;

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
  unit: string;

  @IsOptional({})
  @IsNumber({}, { message: 'Product stock must be a number' })
  stock: number;

  @IsOptional()
  @IsString({ message: 'Product image must be a string' })
  image: string;

  @IsOptional()
  quantity: number;

  @IsBoolean({ message: 'Product isSvailable must be a boolean' })
  isAvailable: boolean;
}
