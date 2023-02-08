import { HydratedDocument } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserInputModelType } from '../types/usersTypes/userInputModelType';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import * as bcrypt from 'bcrypt';

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

  @Prop(
    raw({
      confirmationCode: { type: String },
      expirationDate: { type: Date },
      isConfirmed: { type: Boolean },
    }),
  )
  EmailConfirmation: Record<string, any>;

  async createUser(userInputModel: UserInputModelType) {
    this.login = userInputModel.login;
    this.email = userInputModel.email;
    this.createdAt = new Date().toISOString();
    this.EmailConfirmation.confirmationCode = uuidv4();
    this.EmailConfirmation.expirationDate = add(new Date(), {
      hours: 1,
      minutes: 30,
    });
    this.EmailConfirmation.isConfirmed = false;
    await this.generatePasswordHash(userInputModel.password);
  }

  async generatePasswordHash(password) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    this.passwordHash = hash;
  }
  async checkPassword(password) {
    const salt = this.passwordHash.slice(0, 29);
    const checkedHash = await bcrypt.hash(password, salt);
    return checkedHash === this.passwordHash;
  }
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods = {
  generatePasswordHash: User.prototype.generatePasswordHash,
  createUser: User.prototype.createUser,
  checkPassword: User.prototype.checkPassword,
};
export const UserModel = { name: User.name, schema: UserSchema };
