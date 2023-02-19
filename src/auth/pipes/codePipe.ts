import { IsNotEmpty } from 'class-validator';

export class CodePipe {
  @IsNotEmpty()
  code: string;
}
