import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BanStatusEntity = HydratedDocument<BanStatus>;

@Schema()
export class BanStatus {
  @Prop({ required: true })
  bloggerId: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  isBanned: boolean;

  @Prop({ required: true })
  banDate: string;

  @Prop({ required: true })
  banReason: string;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  userId: string;

  createBanStatus(
    bloggerId: string,
    blogId: string,
    banReason: string,
    userId: string,
    userLogin: string,
  ) {
    this.bloggerId = bloggerId;
    this.blogId = blogId;
    this.isBanned = true;
    this.banDate = new Date().toISOString();
    this.banReason = banReason;
    this.userId = 'userId';
    this.login = userLogin;
  }
}
export const BanStatusSchema = SchemaFactory.createForClass(BanStatus);
BanStatusSchema.methods = {
  createBanStatus: BanStatus.prototype.createBanStatus,
};

export const BanStatusModel = { name: BanStatus.name, schema: BanStatusSchema };
