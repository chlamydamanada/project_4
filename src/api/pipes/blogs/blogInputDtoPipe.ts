import { IsNotEmpty, IsUrl, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class blogInputModelPipe {
  @Length(0, 15)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name: string;

  @Length(3, 500)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  description: string;

  @IsUrl()
  @Length(5, 100)
  @IsNotEmpty()
  websiteUrl: string;
}
const trim = (value) => {
  return value.trim();
};
