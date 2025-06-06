import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Category must be a string' })
  name: string;
}
