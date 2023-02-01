import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../../application/users.service';
import { UsersQweryRepository } from '../repositoriesQwery/usersQwery.repository';
import { UsersRepository } from '../../repositories/users.repository';
import { userQueryType } from '../../types/usersTypes/userQweryType';
import { UserInputModelType } from '../../types/usersTypes/userInputModelType';
import { UsersViewType } from '../../types/usersTypes/usersViewType';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQweryRepository: UsersQweryRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  @Get()
  async getAllUsers(
    @Query() query: userQueryType,
  ): Promise<UsersViewType | string> {
    try {
      const users = await this.usersQweryRepository.getAllUsers(query);
      return users;
    } catch (e) {
      return 'users/getAllUsers' + e;
    }
  }
  @Post()
  async createUser(@Body() userInputModel: UserInputModelType) {
    try {
      const newUserId = await this.usersService.createUser(
        userInputModel.login,
        userInputModel.email,
        userInputModel.password,
      );
      const newUser = await this.usersQweryRepository.getUserByUserId(
        newUserId,
      );
      return newUser;
    } catch (e) {
      return 'users/createUser' + e;
    }
  }
  @Delete(':id')
  async deleteUserByUserId(@Param('id') userId: string) {
    try {
      const isUser = await this.usersQweryRepository.getUserByUserId(userId);
      if (!isUser) throw new Error('User with this id does not exist');
      await this.usersService.deleteUserById(userId);
      return;
    } catch (e) {
      return 'users/deleteUserByUserId' + e;
    }
  }
}
