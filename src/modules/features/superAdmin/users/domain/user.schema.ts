import { HydratedDocument, Model } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import bcrypt from 'bcrypt';
import { emailConfirmationType } from '../usersTypes/emailConfirmationType';
import { PasswordRecoveryInfoType } from '../usersTypes/passwordRecoveryInfoType';
import { UserDtoType } from '../usersTypes/userInputModelType';
import { BanInfoType } from '../usersTypes/banInfoType';
import { UpdatingBanStatusDtoType } from '../usersTypes/updatingBanStatusDtoType';

export type UserEntity = HydratedDocument<User>;
export type UserModel = Model<UserEntity> & typeof statics;

const statics = {
  createUser(dto: UserDtoType): UserEntity {
    const user = {
      login: dto.login,
    };

    return new this(user);
  },
};

@Schema({
  statics,
})
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
  emailConfirmation: emailConfirmationType;

  @Prop(
    raw({
      recoveryCode: { type: String },
      expirationDate: { type: Date },
    }),
  )
  passwordRecoveryInfo: PasswordRecoveryInfoType;

  @Prop(
    raw({
      isBanned: { required: true, type: Boolean },
      banDate: { type: String },
      banReason: { type: String },
    }),
  )
  banInfo: BanInfoType;

  async createUser(userInputModel: UserDtoType) {
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
    this.banInfo.isBanned = false;
    this.banInfo.banDate = null;
    this.banInfo.banReason = null;
    await this.generatePasswordHash(userInputModel.password);
  }

  banOrUnbanUser(banDto: UpdatingBanStatusDtoType) {
    if (banDto.isBanned) {
      this.banInfo.isBanned = true;
      this.banInfo.banDate = new Date().toISOString();
      this.banInfo.banReason = banDto.banReason;
    } else {
      this.banInfo.isBanned = false;
      this.banInfo.banDate = null;
      this.banInfo.banReason = null;
    }
  }
  //delete
  async generatePasswordHash(password: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);
    this.passwordHash = hash;
  }
  //delete
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
  banOrUnbanUser: User.prototype.banOrUnbanUser,
};
export const UserModel = { name: User.name, schema: UserSchema };
