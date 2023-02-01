import { Length } from 'class-validator';

export class blogInputModelType {
  @Length(3, 15)
  name: string;
  @Length(3, 500)
  description: string;
  @Length(5, 100)
  websiteUrl: string;
}
