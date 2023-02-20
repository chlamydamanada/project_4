import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @Length(3, 50)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  loginOrEmail: string;

  @Length(6, 20)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  password: string;
}
