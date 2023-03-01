import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { UserInputModelType } from '../usersTypes/userInputModelType';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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
    if (isExistByEmail)
      throw new BadRequestException([
        {
          message: 'Email already exist',
          field: 'email',
        },
      ]);
    const newUser = this.usersRepository.getUserEntity();
    await newUser.createUser(userInputModel);
    const newUserId = await this.usersRepository.saveUser(newUser);
    return newUserId;
  }
}
