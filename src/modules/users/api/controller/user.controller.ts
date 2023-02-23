import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../../application/users.service';
import { UsersQweryRepository } from '../qweryRepositories/usersQwery.repository';
import { BasicAuthGuard } from '../../../auth/guards/auth-guard';
import { UserQweryPipe } from '../pipes/userQweryPipe';
import { UsersViewType } from '../../usersTypes/usersViewType';
import { userInputModelPipe } from '../pipes/userInputDtoPipe';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersQweryRepository: UsersQweryRepository,
  ) {}
  @Get()
  @HttpCode(200)
  @UseGuards(BasicAuthGuard)
  async getAllUsers(
    @Query() query: UserQweryPipe,
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
