import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class userInputModelPipe {
  @IsNotEmpty()
  @Length(3, 10)
  login: string;
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
