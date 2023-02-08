import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserEntity } from '../domain/user.schema';
import { UsersRepository } from '../repositories/users.repository';
import bcrypt from 'bcrypt';
import { UserInputModelType } from '../types/usersTypes/userInputModelType';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserEntity>,
    private readonly usersRepository: UsersRepository,
  ) {}
  async createUser(userInputModel: UserInputModelType) {
    const newUser = new this.userModel();
    await newUser.createUser(userInputModel);
    const newUserId = await this.usersRepository.saveUser(newUser);
    return newUserId;
  }
  async deleteUserById(userId: string) {
    const user = await this.usersRepository.findUserById(userId);
    if (!user) throw new NotFoundException('User with this id does not exist');

    await this.usersRepository.deleteUserById(userId);
    return true;
  }

  async deleteAllUsers(): Promise<void> {
    await this.usersRepository.deleteAllUsers();
    return;
  }
}
