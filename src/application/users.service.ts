import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserEntity } from '../domain/user.schema';
import { UsersRepository } from '../repositories/users.repository';
import { UserInputModelType } from '../types/usersTypes/userInputModelType';
import { MailService } from '../email/email.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserEntity>,
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailService,
  ) {}

  async createUser(userInputModel: UserInputModelType): Promise<string> {
    const isExistByLogin = await this.usersRepository.findUserByLoginOrEmail(
      userInputModel.login,
    );
    if (isExistByLogin)
      throw new BadRequestException([
        {
          message: 'login already exist',
          field: 'login',
        },
      ]);
    const isExistByEmail = await this.usersRepository.findUserByLoginOrEmail(
      userInputModel.email,
    );
    console.log('isExistByEmail:', isExistByEmail);
    if (isExistByEmail)
      throw new BadRequestException([
        {
          message: 'Email already exist',
          field: 'email',
        },
      ]);
    const newUser = new this.userModel();
    await newUser.createUser(userInputModel);
    const newUserId = await this.usersRepository.saveUser(newUser);
    return newUserId;
  }

  async deleteUserById(userId: string): Promise<void> {
    const user = await this.usersRepository.findUserById(userId);
    if (!user) throw new NotFoundException('User with this id does not exist');

    await this.usersRepository.deleteUserById(userId);
    return;
  }

  async deleteAllUsers(): Promise<void> {
    await this.usersRepository.deleteAllUsers();
    return;
  }
}
