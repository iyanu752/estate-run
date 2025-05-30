import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

export class UpdateProfileDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @IsNumber({}, { message: 'Phone number must be a number' })
  phone: number;

  @IsNotEmpty({ message: 'Adress is required' })
  @IsString({ message: 'Adress must be a string' })
  adress: string;

  @IsOptional()
  @IsString({ message: 'Profile image must be a string' })
  profileImage?: string;

  @IsOptional()
  @IsString({ message: 'Estate must be a string' })
  estate?: string;
}
