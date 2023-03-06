import { IsBoolean, IsNotEmpty, IsString, Length } from 'class-validator';

export class BanStatusByBloggerPipe {
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;

  @IsNotEmpty()
  @Length(20, 200)
  @IsString()
  banReason: string;

  @IsNotEmpty()
  @IsString()
  blogId: string;
}
