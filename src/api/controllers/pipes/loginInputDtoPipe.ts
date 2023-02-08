import { IsNotEmpty, Length } from 'class-validator';

export class loginInputModelPipe {
  @IsNotEmpty()
  @Length(3, 50)
  loginOrEmail: string;
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
