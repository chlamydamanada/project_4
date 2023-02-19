import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class userInputModelPipe {
  @IsNotEmpty()
  @Length(3, 10)
  @IsString()
  login: string;
  @IsNotEmpty()
  @Length(6, 20)
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
