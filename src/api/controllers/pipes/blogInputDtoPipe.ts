import { IsNotEmpty, IsUrl, Length } from 'class-validator';

export class blogInputModelPipe {
  @IsNotEmpty()
  @Length(3, 15)
  name: string;

  @IsNotEmpty()
  @Length(3, 500)
  description: string;

  @IsUrl()
  @IsNotEmpty()
  @Length(5, 100)
  websiteUrl: string;
}
