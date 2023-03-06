import { HydratedDocument } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BanInfoType } from '../../../superAdmin/users/usersTypes/banInfoType';
import { BanStatusUserInfoType } from '../types/banStatusUserInfoType';

export type BanStatusEntity = HydratedDocument<BanStatus>;

@Schema()
export class BanStatus {
  @Prop({ required: true })
  bloggerId: string;

  @Prop({ required: true })
  blogId: string;

  @Prop(
    raw({
      isBanned: { required: true, type: Boolean },
      banDate: { required: true, type: String },
      banReason: { required: true, type: String },
    }),
  )
  banInfo: BanInfoType;

  @Prop(
    raw({
      userLogin: { required: true, type: String },
      userId: { required: true, type: String },
    }),
  )
  userInfo: BanStatusUserInfoType;

  createBanStatus(dto) {
    this.bloggerId = dto.bloggerId;
    this.blogId = dto.blogId;
    this.banInfo.isBanned = true;
    this.banInfo.banDate = new Date().toISOString();
    this.banInfo.banReason = dto.banReason;
    this.userInfo.userId = dto.userId;
    this.userInfo.userLogin = dto.userLogin;
  }
}
export const BanStatusSchema = SchemaFactory.createForClass(BanStatus);
BanStatusSchema.methods = {
  createBanStatus: BanStatus.prototype.createBanStatus,
};

export const BanStatusModel = { name: BanStatus.name, schema: BanStatusSchema };
