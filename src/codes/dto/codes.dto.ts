import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDate,
} from 'class-validator';

export class CreateCodeDto {
  @IsNotEmpty({ message: 'visitor name is required' })
  @IsString({ message: 'visitor name must be a string' })
  visitorName: string;

  @IsNotEmpty({ message: 'visitor phone can not be empty' })
  @IsNumber({}, { message: 'visitors phone must be a number' })
  visitorPhone: number;

  @IsNotEmpty({
    message: 'Product category is required',
  })
  @IsOptional()
  @IsString({ message: 'purpose of visit must be a string' })
  purposeOfVisit: string;

  @IsDate()
  @IsNotEmpty({ message: 'date is required' })
  date: Date;

  @IsNotEmpty({ message: 'from time is required' })
  @IsNumber({}, { message: 'from must be a number' })
  from: number;

  @IsNotEmpty({ message: 'to time is required' })
  @IsNumber({}, { message: 'to must be a number' })
  to: number;

  @IsOptional()
  @IsString({ message: 'special instructions must be a string' })
  specialInstructions: string;

  @IsOptional()
  @IsNumber({}, { message: 'Code must be a number' })
  verificationCode: number;
}
