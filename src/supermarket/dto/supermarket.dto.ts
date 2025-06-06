import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSupermarketDto {
  @IsNotEmpty({ message: 'Supermarket name is required' })
  @IsString({ message: 'Supermarket name must be a string' })
  name: string;

  @IsNotEmpty({ message: 'Supermarket address is required' })
  @IsString({ message: 'Supermarket address must be a  string' })
  @IsOptional()
  @IsString({ message: 'Supermarket description mus be a string' })
  description: string;

  @IsNotEmpty({ message: 'Supermarket owner Id is required' })
  @IsString({ message: 'Supermarket owner Id must be a string' })
  ownerId: string;
}
