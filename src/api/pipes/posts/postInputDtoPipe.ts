import { IsNotEmpty, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class blogPostInputModelPipe {
  @IsNotEmpty()
  @Length(1, 30)
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsNotEmpty()
  @Length(1, 100)
  @Transform(({ value }) => value?.trim())
  shortDescription: string;

  @IsNotEmpty()
  @Length(1, 1000)
  @Transform(({ value }) => value?.trim())
  content: string;
}

export class postInputModelIdPipe {
  @IsNotEmpty()
  @Length(1, 30)
  @Transform(({ value }) => value?.trim())
  title: string;

  @IsNotEmpty()
  @Length(1, 100)
  @Transform(({ value }) => value?.trim())
  shortDescription: string;

  @IsNotEmpty()
  @Length(1, 1000)
  @Transform(({ value }) => value?.trim())
  content: string;

  @IsNotEmpty()
  @Length(1, 1000)
  @Transform(({ value }) => value?.trim())
  blogId: string;
}
