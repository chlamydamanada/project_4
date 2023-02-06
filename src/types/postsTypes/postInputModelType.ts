import { IsNotEmpty, Length } from 'class-validator';

export class postInputModelType {
  @IsNotEmpty()
  @Length(1, 30)
  title: string;

  @IsNotEmpty()
  @Length(1, 100)
  shortDescription: string;

  @IsNotEmpty()
  @Length(1, 1000)
  content: string;
}
