import { IsNotEmpty, Length } from 'class-validator';

export class commentInputDtoPipe {
  @IsNotEmpty()
  @Length(20, 300)
  content: string;
}
