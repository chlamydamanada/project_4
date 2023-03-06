import { HydratedDocument, Model } from 'mongoose';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { emailConfirmationType } from '../usersTypes/emailConfirmationType';
import { PasswordRecoveryInfoType } from '../usersTypes/passwordRecoveryInfoType';
import { BanInfoType } from '../usersTypes/banInfoType';
import { UserCreatingDtoType } from '../usersTypes/userCreatingDtoType';

export type UserEntity = HydratedDocument<User>;
export type UserModelType = Model<UserEntity> & typeof statics;

const statics = {
  createUser(userDto: UserCreatingDtoType): UserEntity {
    const user = {
      login: userDto.login,
      email: userDto.email,
      passwordHash: userDto.passwordHash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
      passwordRecoveryInfo: {
        recoveryCode: null,
        expirationDate: null,
      },
      banInfo: {
        isBanned: false,
        banDate: null,
        banReason: null,
      },
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

  banOrUnbanUser(banDto) {
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

  async changePasswordHash(passwordHash: string) {
    this.passwordHash = passwordHash;
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
  changePasswordHash: User.prototype.changePasswordHash,
  confirmEmail: User.prototype.confirmEmail,
  generateNewConfirmationCode: User.prototype.generateNewConfirmationCode,
  generatePasswordRecoveryCode: User.prototype.generatePasswordRecoveryCode,
  banOrUnbanUser: User.prototype.banOrUnbanUser,
};
export const UserModel = { name: User.name, schema: UserSchema };
