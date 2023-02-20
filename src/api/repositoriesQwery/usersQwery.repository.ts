import { Injectable } from '@nestjs/common';
import { userQueryType } from '../../types/usersTypes/userQweryType';
import { UsersViewType } from '../../types/usersTypes/usersViewType';
import { UserViewType } from '../../types/usersTypes/userViewType';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserEntity } from '../../domain/user.schema';
import { makeViewUser } from '../../helpers/helperFunctions/makerViewUser';
import { sortingQueryFields } from '../../helpers/helperFunctions/qweryFilter';
import { makeLoginOrEmailFilter } from '../../helpers/helperFunctions/loginOrEmailFilter';
import { makeViewUsers } from '../../helpers/helperFunctions/makerViewUsers';
import { MeViweType } from '../../auth/types/meViweType';

@Injectable()
export class UsersQweryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserEntity>) {}
  async getAllUsers(query: userQueryType): Promise<UsersViewType> {
    const loginOrEmailFilter = makeLoginOrEmailFilter(
      query.searchLoginTerm,
      query.searchEmailTerm,
    );
    const totalCount = await this.userModel.count(loginOrEmailFilter);
    const users = await this.userModel
      .find(loginOrEmailFilter)
      .sort({ [query.sortBy]: query.sortDirection as 1 | -1 })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize);
    const result = makeViewUsers(
      users,
      totalCount,
      query.pageSize,
      query.pageNumber,
    );
    return result;
  }
  async getUserByUserId(userId: string): Promise<UserViewType | undefined> {
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
    });
    if (!user) return undefined;
    return makeViewUser(user);
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
}
