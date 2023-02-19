import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailPipe {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;
}
