import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { HydratedDocument } from 'mongoose';
import { CreateStatusDtoType } from '../statusTypes/createStatusDtoType';

export type StatusEntity = HydratedDocument<Status>;

@Schema()
export class Status {
  @Prop({ required: true })
  entity: string;

  @Prop({ required: true })
  entityId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userLogin: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  addedAt: string;

  @Prop({ required: true })
  isOwnerBanned: boolean;

  createStatus(dto: CreateStatusDtoType) {
    this.entity = dto.entity;
    this.entityId = dto.entityId;
    this.userId = dto.userId;
    this.userLogin = dto.userLogin;
    this.status = dto.status;
    this.addedAt = new Date().toISOString();
    this.isOwnerBanned = false;
  }
  updateStatus(status: string) {
    this.status = status;
  }
}
export const StatusSchema = SchemaFactory.createForClass(Status);
StatusSchema.methods = {
  createStatus: Status.prototype.createStatus,
  updateStatus: Status.prototype.updateStatus,
};
export const StatusModel = { name: Status.name, schema: StatusSchema };
