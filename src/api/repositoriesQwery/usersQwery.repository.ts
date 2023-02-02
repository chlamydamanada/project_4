import { Injectable } from '@nestjs/common';
import { userQueryType } from '../../types/usersTypes/userQweryType';
import { UsersViewType } from '../../types/usersTypes/usersViewType';
import { UserViewType } from '../../types/usersTypes/userViewType';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserEntity } from '../../domain/user.schema';
import { makeViewUser } from '../../helpers/makerViewUser';
import { sortingQueryFields } from '../../helpers/qweryFilter';
import { makeLoginOrEmailFilter } from '../../helpers/loginOrEmailFilter';
import { makeViewUsers } from '../../helpers/makerViewUsers';

@Injectable()
export class UsersQweryRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserEntity>) {}
  async getAllUsers(query: userQueryType): Promise<UsersViewType> {
    const queryFilter = sortingQueryFields(query);
    const loginOrEmailFilter = makeLoginOrEmailFilter(
      query.searchLoginTerm,
      query.searchEmailTerm,
    );
    const totalCount = await this.userModel.count(loginOrEmailFilter);
    const users = await this.userModel
      .find(loginOrEmailFilter)
      .sort({ [queryFilter.sortBy]: queryFilter.sortDirection })
      .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
      .limit(queryFilter.pageSize);
    const result = makeViewUsers(
      users,
      totalCount,
      queryFilter.pageSize,
      queryFilter.pageNumber,
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
}
