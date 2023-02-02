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

  @Prop({ required: true })
  createdAt: string;

  generatePasswordHash(password) {
    this.passwordHash = password;
  }
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods = {
  generatePasswordHash: User.prototype.generatePasswordHash,
};
export const UserModel = { name: User.name, schema: UserSchema };
