import { IsEnum, IsNotEmpty } from 'class-validator';
import { reactionStatusType } from '../../../types/statusTypes/statusType';

export class StatusPipe {
  @IsNotEmpty()
  @IsEnum(reactionStatusType)
  likeStatus: reactionStatusType;
}
