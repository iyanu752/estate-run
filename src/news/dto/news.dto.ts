import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateNewsDto {
  @IsNotEmpty({ message: 'Head line can not be empty' })
  @IsString({ message: 'Headline must be a string' })
  headline: string;

  @IsNotEmpty({ message: 'Message must not be empty' })
  @IsString({ message: 'Message must be a string' })
  message: string;

  @IsBoolean()
  isLiked: boolean;

  @IsOptional()
  @IsString({ message: 'comment must be a string' })
  comment: string;
}

export class UpdateNewsDto {
  @IsNotEmpty({ message: 'Head line can not be empty' })
  @IsString({ message: 'Headline must be a string' })
  headline: string;

  @IsNotEmpty({ message: 'Message must not be empty' })
  @IsString({ message: 'Message must be a string' })
  message: string;

  @IsOptional()
  @IsString({ message: 'comment must be a string' })
  comment: string;
}
