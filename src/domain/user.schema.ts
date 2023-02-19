import { HydratedDocument } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserInputModelType } from '../types/usersTypes/userInputModelType';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import bcrypt from 'bcrypt';
import { emailConfirmation } from '../types/usersTypes/emailConfirmationType';
import { PasswordRecoveryInfoType } from '../types/usersTypes/passwordRecoveryInfoType';

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
      confirmationCode: { required: true, type: String },
      expirationDate: { required: true, type: Date },
      isConfirmed: { required: true, type: Boolean },
    }),
  )
  emailConfirmation: emailConfirmation;

  @Prop(
    raw({
      recoveryCode: { type: String },
      expirationDate: { type: Date },
    }),
  )
  passwordRecoveryInfo: PasswordRecoveryInfoType;

  async createUser(userInputModel: UserInputModelType) {
    this.login = userInputModel.login;
    this.email = userInputModel.email;
    this.createdAt = new Date().toISOString();
    this.emailConfirmation.confirmationCode = uuidv4();
    this.emailConfirmation.expirationDate = add(new Date(), {
      hours: 1,
      minutes: 30,
    });
    this.emailConfirmation.isConfirmed = false;
    this.passwordRecoveryInfo.recoveryCode = null;
    this.passwordRecoveryInfo.expirationDate = null;
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

  confirmEmail() {
    this.emailConfirmation.isConfirmed = true;
  }

  generateNewConfirmationCode() {
    this.emailConfirmation.confirmationCode = uuidv4();
    this.emailConfirmation.expirationDate = add(new Date(), {
      hours: 1,
      minutes: 30,
    });
    this.emailConfirmation.isConfirmed = false;
  }

  generatePasswordRecoveryCode() {
    this.passwordRecoveryInfo.recoveryCode = uuidv4();
    this.passwordRecoveryInfo.expirationDate = add(new Date(), {
      hours: 1,
      minutes: 30,
    });
  }
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods = {
  generatePasswordHash: User.prototype.generatePasswordHash,
  createUser: User.prototype.createUser,
  checkPassword: User.prototype.checkPassword,
  confirmEmail: User.prototype.confirmEmail,
  generateNewConfirmationCode: User.prototype.generateNewConfirmationCode,
  generatePasswordRecoveryCode: User.prototype.generatePasswordRecoveryCode,
};
export const UserModel = { name: User.name, schema: UserSchema };
