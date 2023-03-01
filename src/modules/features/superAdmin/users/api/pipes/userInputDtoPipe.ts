import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class userInputModelPipe {
  @IsNotEmpty()
  @Length(3, 10)
  @IsString()
  @Transform(({ value }) => value?.trim())
  login: string;

  @IsNotEmpty()
  @Length(6, 20)
  @IsString()
  @Transform(({ value }) => value?.trim())
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value?.trim())
  email: string;
}
