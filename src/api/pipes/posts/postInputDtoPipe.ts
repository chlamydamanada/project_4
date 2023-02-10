import { IsNotEmpty, Length } from 'class-validator';

export class blogPostInputModelPipe {
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

export class postInputModelIdPipe {
  @IsNotEmpty()
  @Length(1, 30)
  title: string;

  @IsNotEmpty()
  @Length(1, 100)
  shortDescription: string;

  @IsNotEmpty()
  @Length(1, 1000)
  content: string;

  @IsNotEmpty()
  @Length(1, 1000)
  blogId: string;
}
