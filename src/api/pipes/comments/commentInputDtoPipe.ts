import { IsNotEmpty, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class commentInputDtoPipe {
  @IsNotEmpty()
  @Length(20, 300)
  @Transform(({ value }) => value?.trim())
  content: string;
}
