import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserEntity } from '../../domain/user.schema';
import { userQueryType } from '../../usersTypes/userQweryType';
import { UsersViewType } from '../../usersTypes/usersViewType';
import { makeLoginOrEmailFilter } from '../../../../helpers/helperFunctions/loginOrEmailFilter';
import { UserViewType } from '../../usersTypes/userViewType';
import { MeViweType } from '../../../auth/types/meViweType';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserEntity>) {}
  async getAllUsers(query: userQueryType): Promise<UsersViewType> {
    const loginOrEmailFilter = makeLoginOrEmailFilter(
      query.searchLoginTerm,
      query.searchEmailTerm,
      query.banStatus,
    );
    const totalCount = await this.userModel.count(loginOrEmailFilter);
    const users = await this.userModel
      .find(loginOrEmailFilter)
      .sort({ [query.sortBy]: query.sortDirection as 1 | -1 })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);
    const result = users.map((u) => this.makeViewUser(u));
    return {
      pagesCount: Math.ceil(totalCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalCount,
      items: result,
    };
  }
  async getUserByUserId(userId: string): Promise<UserViewType | undefined> {
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
    });
    if (!user) return undefined;
    return this.makeViewUser(user);
  }
  async getMyProfile(userId: string): Promise<MeViweType | undefined> {
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
    });
    if (!user) return undefined;
    return {
      email: user.email,
      login: user.login,
      userId: userId,
    };
  }

  makeViewUser(user: UserEntity): UserViewType {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
      banInfo: user.banInfo,
    };
  }
}
