import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserEntity } from '../domain/user.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserEntity>) {}

  async saveUser(user: UserEntity) {
    const newUser = await user.save();
    return newUser._id.toString();
  }

  async findUserById(userId: string) {
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
    });
    return user;
  }

  async deleteUserById(userId: string): Promise<void> {
    await this.userModel.deleteOne({
      _id: new Types.ObjectId(userId),
    });
    return;
  }

  async deleteAllUsers(): Promise<void> {
    await this.userModel.deleteMany({});
    return;
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
}
