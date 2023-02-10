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
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../../application/users.service';
import { UsersQweryRepository } from '../repositoriesQwery/usersQwery.repository';
import { UsersRepository } from '../../repositories/users.repository';
import { userQueryType } from '../../types/usersTypes/userQweryType';
import { UsersViewType } from '../../types/usersTypes/usersViewType';
import { userInputModelPipe } from '../pipes/users/userInputDtoPipe';
import { BasicAuthGuard } from '../guards/auth-guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQweryRepository: UsersQweryRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  @Get()
  @UseGuards(BasicAuthGuard)
  async getAllUsers(
    @Query() query: userQueryType,
    //todo qwery pipe
  ): Promise<UsersViewType | string> {
    const users = await this.usersQweryRepository.getAllUsers(query);
    return users;
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  async createUser(@Body() userInputModel: userInputModelPipe) {
    const newUserId = await this.usersService.createUser(userInputModel);
    const newUser = await this.usersQweryRepository.getUserByUserId(newUserId);
    return newUser!;
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async deleteUserByUserId(
    @Param('id') userId: string,
  ): Promise<void | string> {
    await this.usersService.deleteUserById(userId);
    return;
  }
}
