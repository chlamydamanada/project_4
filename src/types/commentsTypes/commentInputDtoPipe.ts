import { IsNotEmpty, Length } from 'class-validator';

export class commentInputDtoType {
  @IsNotEmpty()
  @Length(20, 300)
  content: string;
}
