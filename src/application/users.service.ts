import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserEntity } from '../domain/user.schema';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserEntity>,
    private readonly usersRepository: UsersRepository,
  ) {}
  async createUser(login: string, email: string, password: string) {
    const newUser = new this.userModel({ login, email, password });
    const newUserId = await this.usersRepository.saveUser(newUser);
    return newUserId;
  }
  async deleteUserById(userId: string) {
    await this.usersRepository.deleteUserById(userId);
    return true;
  }

  async deleteAllUsers(): Promise<void> {
    await this.usersRepository.deleteAllUsers();
    return;
  }
}
