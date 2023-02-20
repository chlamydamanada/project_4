import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsBlogExist } from '../../../helpers/decorators/isBlogExist.decorator';

export class blogPostInputModelPipe {
  @IsNotEmpty()
  @Length(1, 30)
  @Transform(({ value }) => value?.trim())
  @IsString()
  title: string;

  @IsNotEmpty()
  @Length(1, 100)
  @Transform(({ value }) => value?.trim())
  @IsString()
  shortDescription: string;

  @IsNotEmpty()
  @Length(1, 1000)
  @Transform(({ value }) => value?.trim())
  @IsString()
  content: string;
}

export class postInputModelIdPipe {
  @IsNotEmpty()
  @Length(1, 30)
  @Transform(({ value }) => value?.trim())
  @IsString()
  title: string;

  @IsNotEmpty()
  @Length(1, 100)
  @Transform(({ value }) => value?.trim())
  @IsString()
  shortDescription: string;

  @IsNotEmpty()
  @Length(1, 1000)
  @Transform(({ value }) => value?.trim())
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsBlogExist()
  @IsString()
  blogId: string;
}
