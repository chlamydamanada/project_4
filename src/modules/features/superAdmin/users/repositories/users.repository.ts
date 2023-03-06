import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserEntity, UserModelType } from '../domain/user.schema';
import { Model, Types } from 'mongoose';
import {
  BanStatus,
  BanStatusEntity,
} from '../../../blogger/banStatus/domain/banStatus.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    @InjectModel(BanStatus.name) private banStatusModel: Model<BanStatusEntity>,
  ) {}

  getUserEntity(
    login: string,
    email: string,
    passwordHash: string,
  ): UserEntity {
    const userEntity = this.userModel.createUser({
      login,
      email,
      passwordHash,
    });
    return userEntity;
    //return new this.userModel();
  }

  async saveUser(user: UserEntity): Promise<string> {
    const newUser = await user.save();
    return newUser._id.toString();
  }

  async findUserById(userId: string) {
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
    });
    if (!user) return null;
    return user;
  }

  async deleteUserById(userId: string): Promise<void> {
    await this.userModel.deleteOne({
      _id: new Types.ObjectId(userId),
    });
    return;
  }

  async isUserExist(
    login: string,
    email: string,
  ): Promise<{ isExist: boolean; field: 'email' | 'login' | null }> {
    const userByLogin = await this.userModel.findOne({ login });
    if (userByLogin) return { isExist: true, field: 'login' };
    const userByEmail = await this.userModel.findOne({ email });
    if (userByEmail) return { isExist: true, field: 'email' };
    return { isExist: false, field: null };
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<undefined | UserEntity> {
    const user = await this.userModel.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });

    if (!user) return undefined;
    return user;
  }
  async findUserByConfirmationCode(
    code: string,
  ): Promise<undefined | UserEntity> {
    const user = await this.userModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
    if (!user) return undefined;
    return user;
  }

  async findUserByPasswordRecoveryCode(
    code: string,
  ): Promise<undefined | UserEntity> {
    const user = await this.userModel.findOne({
      'passwordRecoveryInfo.recoveryCode': code,
    });
    if (!user) return undefined;
    return user;
  }

  async isUserBannedForBlog(userId: string, blogId: string): Promise<boolean> {
    const status = await this.banStatusModel.findOne({
      blogId,
      'userInfo.userId': userId,
    });
    if (!status) return false;
    return true;
  }
}
