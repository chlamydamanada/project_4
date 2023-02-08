import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from '../../application/users.service';
import { UsersQweryRepository } from '../repositoriesQwery/usersQwery.repository';
import { UsersRepository } from '../../repositories/users.repository';
import { userQueryType } from '../../types/usersTypes/userQweryType';
import { UsersViewType } from '../../types/usersTypes/usersViewType';
import { userInputModelPipe } from './pipes/userInputDtoPipe';

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
    const users = await this.usersQweryRepository.getAllUsers(query);
    return users;
  }

  @Post()
  async createUser(@Body() userInputModel: userInputModelPipe) {
    const newUserId = await this.usersService.createUser(userInputModel);
    const newUser = await this.usersQweryRepository.getUserByUserId(newUserId);
    return newUser!;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUserByUserId(
    @Param('id') userId: string,
  ): Promise<void | string> {
    await this.usersService.deleteUserById(userId);
    return;
  }
}
