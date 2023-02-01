import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserEntity = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ default: new Date().toISOString() })
  createdAt: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
export const UserModel = { name: User.name, schema: UserSchema };
