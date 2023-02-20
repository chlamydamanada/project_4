import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class blogInputModelPipe {
  @Length(0, 15)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  name: string;

  @Length(3, 500)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  description: string;

  @IsUrl()
  @Length(5, 100)
  @IsNotEmpty()
  @IsString()
  websiteUrl: string;
}
