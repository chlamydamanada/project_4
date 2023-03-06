import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserModelType,
} from '../../../superAdmin/users/domain/user.schema';
import {
  BanStatus,
  BanStatusEntity,
} from '../../banStatus/domain/banStatus.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersForBloggerRepository {
  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    @InjectModel(BanStatus.name) private banStatusModel: Model<BanStatusEntity>,
  ) {}
  async findUserById(userId: string) {
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
    });
    if (!user) return null;
    return user;
  }
  async getBanStatusEntity(): Promise<BanStatusEntity> {
    return new this.banStatusModel();
  }
  async banUserByBlogger(status: BanStatusEntity): Promise<void> {
    await status.save();
    return;
  }
  async unbanUserByBlogger(userId: string, blogId: string): Promise<void> {
    await this.banStatusModel.deleteOne({ blogId, 'userInfo.userId': userId });
    return;
  }
}
