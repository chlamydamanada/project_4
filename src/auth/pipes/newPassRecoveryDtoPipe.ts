import { IsNotEmpty, IsString, Length } from 'class-validator';

export class NewPassRecoveryDtoPipe {
  @Length(6, 20)
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  recoveryCode: string;
}
